const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const errorFormatter = require('../../utils/errorFormatter');
const auth = require('../../middlewares/auth');
const User = require('../../models/User');

/*
    URL: GET /api/users
    Returns the currently authenticated user
*/
router.get('/', auth, async (req, res) => {
	res.status(200).json(req.user);
});

/*
    URL: POST /api/users
    Creates a user, sets the Location header to "/", and returns no content
*/
router.post(
	'/',
	[
		check('fullName', 'Please include name').notEmpty(),
		check('emailAddress', 'Please include valid email').isEmail(),
		check('password', 'Please provide password').notEmpty(),
		check('confirmPassword', 'Please confirm password').custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Passwords do not match');
			} else {
				return value;
			}
		})
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errorFormatter(errors.array(), 400));
		}

		try {
			const { fullName, emailAddress, password } = req.body;

			let user = await User.findOne({ emailAddress });

			if (user) return res.status(400).json(errorFormatter('User already exists', 400));

			user = new User({
				fullName,
				emailAddress,
				password
			});

			user.password = await bcrypt.hash(password, 10);

			await user.save();

			// project requirement ¯\_(ツ)_/¯
			res.setHeader('Location', '/');
			res.status(201).json({});
		} catch (e) {
			res.status(500).json(errorFormatter('Could not register a user'));
		}
	}
);

module.exports = router;
