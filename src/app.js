'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const errorFormatter = require('./utils/errorFormatter');

// app/database
const app = express();
const connectDatabase = require('./db/database');

connectDatabase();

if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'));
}

// json parser
app.use(express.json());

// TODO add additional routes here
app.use('/api/users', require('./routes/api/users'));
app.use('/api/courses', require('./routes/api/courses'));

// send a friendly greeting for the root route
app.get('/', (req, res) => {
	res.json({
		message: 'Welcome to the Course Review API'
	});
});

// uncomment this route in order to test the global error handler
// app.get('/error', function (req, res) {
//   throw new Error('Test error');
// });

// send 404 if no other route matched
app.use((req, res) => {
	res.status(404).json(errorFormatter('Route Not Found', 404));
});

// global error handler
app.use((err, req, res, next) => {
	const { errors } = err.errors || {};
	res.status(err.status || 500).json({
		message: err.message,
		// append errors if exist
		...(errors && { errors })
	});
});

module.exports = app; // for testing
