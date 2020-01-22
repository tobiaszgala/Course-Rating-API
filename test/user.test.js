const req = require('supertest');
const app = require('../src/app');
const { userOne, setupDatabase, cleanDatabase } = require('./fixtures/db');
const { authHeader } = require('./fixtures/utils');

// setup and clean database
beforeAll(setupDatabase);

afterAll(cleanDatabase);

describe('Testing users GET requests (/api/users)', () => {
	it('Should return data of authenticated user', async () => {
		// encode email and password to base64
		const base64 = authHeader(userOne.emailAddress, userOne.password);
		// send request to api with authentication header
		const res = await req(app).get('/api/users').set('Authorization', `Basic ${base64}`).expect(200);

		const { fullName, emailAddress } = res.body;

		// check response object
		expect(fullName).toBe(userOne.fullName);
		expect(emailAddress).toBe(userOne.emailAddress);
	});

	it('Should display error message when no Authorization header is provided', async () => {
		const res = await req(app).get('/api/users').send().expect(401);

		expect(res.body.errors[0]).toStrictEqual({ message: 'Please provide credentials', status: 401 });
	});

	it('Should display error message when invalid credentials are provided', async () => {
		const base64 = authHeader('invalid@email.com', 'badpassword');
		const res = await req(app).get('/api/users').set('Authorization', `Basic ${base64}`).send().expect(401);

		expect(res.body.errors[0]).toStrictEqual({ message: 'Unauthorized', status: 401 });
	});
});
