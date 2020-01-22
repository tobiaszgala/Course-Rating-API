const express = require('express');
const router = express.Router();
const Course = require('../../models/Course');
const Review = require('../../models/Review');
const errorFormatter = require('../../utils/errorFormatter');
const { check, validationResult } = require('express-validator');
const auth = require('../../middlewares/auth');

// validation for course fields
const courseValidation = () => [
	check('title', 'Please provide title').notEmpty(),
	check('description', 'Please provide description').notEmpty(),
	check('steps.*.title', 'Each step needs title').notEmpty(),
	check('steps.*.description', 'Each step need description').notEmpty()
];

/*
    GET
*/

/*
    URI: GET /api/courses
    Returns the Course "_id" and "title" properties
*/
router.get('/', async (req, res) => {
	try {
		const courses = await Course.find({}, 'title');
		if (!courses) return res.status(400).json(errorFormatter('No courses found', 400));
		res.status(200).json(courses);
	} catch (e) {
		res.status(500).json(errorFormatter('Could not retrieve courses'));
	}
});

/*
    URI: GET /api/courses/:id
    Returns all Course properties and related documents for the provided course ID
*/
router.get('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const course = await Course.findById(id).populate('user', 'fullName').populate('reviews');

		if (!course) return res.status(400).json(errorFormatter('Could not find course with provided ID', 400));

		res.status(200).json(course);
	} catch (e) {
		res.status(500).json(errorFormatter('Could not retrieve data from server'));
	}
});

/*
    POST
*/

/*
    URI: POST /api/courses
    Creates a course, sets the Location header, and returns no content
*/
router.post('/', [ auth, courseValidation() ], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new Error('Could not add a course');
		err.status = 400;
		err.errors = errorFormatter(errors.array(), err.status);

		return next(err);
		// return res.status(400).json(errorFormatter(errors.array(), 400));
	}

	const { title, description, estimatedTime, materialsNeeded, steps } = req.body;

	try {
		const course = new Course({
			title,
			description,
			steps,
			// if exists
			...(estimatedTime && { estimatedTime }),
			...(materialsNeeded && { materialsNeeded }),
			// course belongs to logged user
			user: req.user._id
		});

		await course.save();

		// project requirement ¯\_(ツ)_/¯
		res.setHeader('Location', '/');
		res.status(201).json({});
	} catch (e) {
		res.status(500).json(errorFormatter('Could not add new course'));
	}
});

/*
    URI: POST /api/courses/:id/reviews
    Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
*/
router.post('/:id/reviews', [ auth, [ check('rating', 'No rating was provided').notEmpty() ] ], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const err = new Error('Could not add a review');
		err.status = 400;
		err.errors = errorFormatter(errors.array(), err.status);

		return next(err);
		// return res.status(400).json(errorFormatter(errors.array(), 400));
	}

	const { id } = req.params;

	try {
		const course = await Course.findById(id);
		if (!course) return res.status(400).json(errorFormatter('Course does not exists', 400));

		if (course.user.toString() === req.user._id.toString())
			return res.status(400).json(errorFormatter('You cannot post review for your own course', 400));

		const { rating, review } = req.body;

		const newReview = new Review({
			user: req.user._id,
			rating,
			...(review && { review }) // if review exists add it to the object
		});

		// add referance to course
		course.reviews.unshift(newReview);

		await newReview.save();
		await course.save();

		res.setHeader('Location', `/api/courses/${id}`);
		res.status(200).json({});
	} catch (e) {
		res.status(500).json(errorFormatter('Could not add review'));
	}
});

/*
    PUT
*/

/*
    URI: PUT /api/courses/:id
    Updates a course and returns no content
*/
router.put('/:id', [ auth, courseValidation() ], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new Error('Could not update the course');
		err.status = 400;
		err.errors = errorFormatter(errors.array(), err.status);

		return next(err);
		// return res.status(400).json(errorFormatter(errors.array(), 400));
	}

	const { id } = req.params;

	try {
		let course = await Course.findById(id);

		if (!course) return res.status(400).json(errorFormatter('Course with provided id does not exists', 400));

		if (course.user._id.toString() !== req.user._id.toString()) {
			return res
				.status(400)
				.json(errorFormatter('You are not the owner of course you are trying to modify', 400));
		}

		const { title, description, estimatedTime, materialsNeeded, steps } = req.body;

		if (title) course.title = title;
		if (description) course.description = description;
		if (estimatedTime) course.estimatedTime = estimatedTime;
		if (materialsNeeded) course.materialsNeeded = materialsNeeded;
		if (steps) course.steps = steps;

		await course.save();

		res.status(204).json({});
	} catch (e) {
		res.status(500).json(errorFormatter('Could not update the course'));
	}
});

module.exports = router;
