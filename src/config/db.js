const mongoose = require('mongoose');
const { db } = require('./config.json');

const connectDatabase = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});
		console.log('Database is connected...');
	} catch (e) {
		console.error(e.message);
		// Exit process
		process.exit(1);
	}
};

module.exports = connectDatabase;
