const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseShema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
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
			_id: false,
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
			ref: 'Review'
		}
	]
});

module.exports = Course = mongoose.model('Course', CourseShema);
