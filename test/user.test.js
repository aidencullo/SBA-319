import { expect } from 'chai';
import request from 'supertest';
import 'dotenv/config';

import app from '../app.js';
import User from '../models/User.js';
import { connectDb, disconnectDb } from '../db/connect.js';

before(async () => {
  await connectDb();
  await User.deleteMany({})
});

after(async function () {
  await User.deleteMany({})
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
