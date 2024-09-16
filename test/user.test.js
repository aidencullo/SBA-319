import { expect } from 'chai';
import request from 'supertest';
import 'dotenv/config';

import app from '../app.js';
import User from '../models/User.js';
import { connectDb, disconnectDb } from '../db/connect.js';

// Set up database connection and cleanup
before(async () => {
  await connectDb();
  await User.deleteMany({});
});

after(async function () {
  await User.deleteMany({});
  await disconnectDb();
});

describe('GET /users', function () {
  it('should return an empty array when no users exist', (done) => {
    request(app)
      .get('/users')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array').that.is.empty;
        done();
      });
  });
});

describe('POST /users', function () {
  it('should create a new user with name, email, and password', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    };

    // Send the POST request and wait for the response
    const res = await request(app)
	  .post('/users')
	  .send(newUser)
	  .expect(201); // Expecting HTTP status code 201 for created

    // Validate response body
    expect(res.body).to.have.property('name', 'John Doe');
    expect(res.body).to.have.property('email', 'johndoe@example.com');

    // Check that the user is actually in the database
    const userInDb = await User.findOne({ email: 'johndoe@example.com' });
    expect(userInDb).to.not.be.null;
    expect(userInDb).to.have.property('name', 'John Doe');
    expect(userInDb).to.have.property('email', 'johndoe@example.com');
  });
});
