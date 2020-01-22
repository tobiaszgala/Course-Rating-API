const app = require('./app');
const port = process.env.PORT;

// start server
app.listen(port, () => {
	console.log(`Express server is listening on port ${port}`);
});
