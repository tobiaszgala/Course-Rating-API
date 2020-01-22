const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	postedOn: {
		type: Date,
		default: Date.now
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5
	},
	review: String
});

module.exports = Review = mongoose.model('Review', ReviewSchema);
