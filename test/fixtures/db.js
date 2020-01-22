const mongoose = require('mongoose');
const User = require('../../src/models/User');

const userOne = {
	fullName: 'John Smith',
	emailAddress: 'john@smith.com',
	password: 'example123'
};

const setupDatabase = async () => {
	await new User(userOne).save();
};

const cleanDatabase = async () => {
	await User.deleteMany();
	// close mongoose connection to exit jest
	mongoose.connection.close();
};

module.exports = {
	userOne,
	setupDatabase,
	cleanDatabase
};
