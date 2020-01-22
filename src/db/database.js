const mongoose = require('mongoose');
const db = process.env.DB_URL;

const connectDatabase = async () => {
	try {
		// connect to mongoose without deprecation warrnings
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
