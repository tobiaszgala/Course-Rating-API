const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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

// project requirements callbacks ¯\_(ツ)_/¯
// authentication method
UserSchema.statics.auth = (email, password, callback) => {
	User.findOne({ emailAddress: email }, (err, user) => {
		if (!user) {
			return callback(null, new Error('No user found'));
		}

		// compare hash with password in database
		const isMatch = bcrypt.compareSync(password, user.password);

		if (isMatch) {
			return callback(user, null);
		} else {
			return callback(null, new Error('No match'));
		}
	});
};

UserSchema.pre('save', async function(next) {
	const user = this;

	// if password modified hash it
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 10);
	}

	next();
});

module.exports = User = mongoose.model('User', UserSchema);
