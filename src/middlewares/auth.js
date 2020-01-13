const auth = require('basic-auth');
const User = require('../models/User');

const checkAuth = async (req, res, next) => {
	const credentials = auth(req);
	if (!credentials)
		return res.status(401).json({
			errors: [
				{
					message: 'Please provide credentials',
					code: 401
				}
			]
		});

	try {
		const { name, pass } = credentials;
		const user = await User.findOne({ emailAddress: name, password: pass });

		if (user) {
			req.user = user;
			return next();
		}

		return res.status(401).json({
			errors: [
				{
					message: 'Unauthorized',
					code: 401
				}
			]
		});
	} catch (e) {
		return res.status(500).json({
			errors: [
				{
					message: 'Could not load data from the server',
					code: 500
				}
			]
		});
	}
};

module.exports = checkAuth;
