const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
	return { message: `${msg}`, code: 400 };
};

module.exports = errorFormatter;
