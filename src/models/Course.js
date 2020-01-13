const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseShema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	estimatedTime: String,
	materialsNeeded: String,
	steps: [
		{
			stepNumber: Number,
			title: {
				type: String,
				required: true
			},
			description: {
				type: String,
				required: true
			}
		}
	],
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'reviews'
		}
	]
});

module.exports = Course = mongoose.model('courses', CourseShema);
