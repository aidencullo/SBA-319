import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import 'dotenv/config';

import app from '../app.js';
import User from '../models/User.js';

before(async () => {
  await mongoose.connect(process.env.ATLAS_URI);
});

after(async function () {
  await mongoose.disconnect();
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
