const authHeader = (email, password) => {
	// convert string to base64
	return Buffer.from(`${email}:${password}`).toString('base64');
};

module.exports = {
	authHeader
};
