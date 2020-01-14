/*
	Tobiasz Gala
	Info: Error formatter function for custom error api messages (works with express-validator)

	- Accepts array of objects for express validator or string

	errorFormatter( [array of errors], 400]) 
	errorFormatter('Error message', 400); 

	// Layout
	{
		errors: [
			{
				message : ...,
				status  : ...
			},
			{
				message : ...,
				status  : ...
			}
		]
	}
*/
const defaultErrorStatus = 500;

const errorFormatter = (errMsg, errStatus = defaultErrorStatus) => {
	// Check if errMsg is string
	if (typeof errMsg === 'string') {
		return {
			errors: [
				{
					message: errMsg,
					status: errStatus
				}
			]
		};
	}

	/*
		If no string provided, express validator array of errors is handled
	*/
	return {
		errors: errMsg.map((err) => {
			return {
				message: err.msg,
				status: err.status || errStatus
			};
		})
	};
};

module.exports = errorFormatter;
