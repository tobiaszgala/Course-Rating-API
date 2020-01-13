const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserShema = new Schema({
	fullName: {
		type: String,
		required: true
	},
	emailAddress: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});

module.exports = User = mongoose.model('users', UserShema);
