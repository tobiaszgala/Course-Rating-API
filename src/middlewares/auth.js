const auth = require('basic-auth');
const User = require('../models/User');
const errorFormatter = require('../utils/errorFormatter');

const checkAuth = async (req, res, next) => {
	const credentials = auth(req);

	// if credentials not sent
	if (!credentials) return res.status(401).json(errorFormatter('Please provide credentials', 401));

	try {
		const { name, pass } = credentials;

		// callback for project requirements
		// run auth method on user model
		User.auth(name, pass, (user, err) => {
			if (err) {
				return res.status(401).json(errorFormatter('Unauthorized', 401));
			}

			req.user = user;
			return next();
		});
	} catch (e) {
		return res.status(500).json(errorFormatter('There was a problem with authentication'));
	}
};

module.exports = checkAuth;
