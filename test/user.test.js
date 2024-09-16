import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import { connectDb, disconnectDb } from '../db/connect.js';

before(async () => {
  await connectDb();
});

after(async function () {
  await disconnectDb();
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterEach(async () => {
  await User.deleteMany({});
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

  it('should return 404 if an invalid endpoint is accessed', (done) => {
    request(app)
      .get('/invalid-endpoint')
      .expect(404, done);
  });
});

describe('POST /users', function () {
  it('should create a new user with name, email, and password', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    };

    const res = await request(app)
      .post('/users')
      .send(newUser)
      .expect(201);

    expect(res.body).to.have.property('name', 'John Doe');
    expect(res.body).to.have.property('email', 'johndoe@example.com');

    const userInDb = await User.findOne({ email: 'johndoe@example.com' });
    expect(userInDb).to.not.be.null;
    expect(userInDb).to.have.property('name', 'John Doe');
    expect(userInDb).to.have.property('email', 'johndoe@example.com');
  });

  it('should return 400 if required fields are missing', async () => {
    const incompleteUser = {
      email: 'incomplete@example.com',
    };

    const res = await request(app)
      .post('/users')
      .send(incompleteUser)
      .expect(400);
  });

  it('should return 400 if email is invalid', async () => {
    const invalidEmailUser = {
      name: 'Invalid Email',
      email: 'invalidemail',
      password: 'password123',
    };

    const res = await request(app)
      .post('/users')
      .send(invalidEmailUser)
      .expect(400);

  });
});

describe('GET /users/:id', function () {
  it('should return a user by id', async () => {
    const user = await User.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .get(`/users/${user._id}`)
      .expect(200);

    expect(res.body).to.have.property('name', 'Jane Doe');
    expect(res.body).to.have.property('email', 'janedoe@example.com');
  });

  it('should return 404 if user is not found', async () => {
    const fakeId = '613a1fd12f82f0a12bc90b12'; // Non-existent ID
    const res = await request(app)
      .get(`/users/${fakeId}`)
      .expect(404);

  });

  it('should return 400 for invalid user ID format', async () => {
    const invalidId = 'invalid-id-format';
    const res = await request(app)
      .get(`/users/${invalidId}`)
      .expect(400);

  });
});

describe('PUT /users/:id', function () {
  it('should update an existing user', async () => {
    const user = await User.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: 'password123',
    });

    const updatedUser = {
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      password: 'newpassword123',
    };

    const res = await request(app)
      .put(`/users/${user._id}`)
      .send(updatedUser)
      .expect(200);

    expect(res.body).to.have.property('name', 'Jane Smith');
    expect(res.body).to.have.property('email', 'janesmith@example.com');

    const userInDb = await User.findById(user._id);
    expect(userInDb).to.have.property('name', 'Jane Smith');
    expect(userInDb).to.have.property('email', 'janesmith@example.com');
  });

  it('should return 400 if required fields are missing in update', async () => {
    const user = await User.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: 'password123',
    });

    const incompleteUpdate = {
      email: 'updated@example.com',
    };

    const res = await request(app)
      .put(`/users/${user._id}`)
      .send(incompleteUpdate)
      .expect(400);

  });

  it('should return 404 if trying to update a non-existent user', async () => {
    const fakeId = '613a1fd12f82f0a12bc90b12'; // Non-existent ID
    const updatedUser = {
      name: 'Non-existent User',
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    const res = await request(app)
      .put(`/users/${fakeId}`)
      .send(updatedUser)
      .expect(404);

  });
});

describe('PATCH /users/:id', function () {
  it('should partially update an existing user', async () => {
    const user = await User.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: 'password123',
    });

    const partialUpdate = {
      name: 'Jane Johnson',
    };

    const res = await request(app)
      .patch(`/users/${user._id}`)
      .send(partialUpdate)
      .expect(200);

    expect(res.body).to.have.property('name', 'Jane Johnson');
    expect(res.body).to.have.property('email', 'janedoe@example.com');

    const userInDb = await User.findById(user._id);
    expect(userInDb).to.have.property('name', 'Jane Johnson');
    expect(userInDb).to.have.property('email', 'janedoe@example.com');
  });

  it('should return 404 if trying to partially update a non-existent user', async () => {
    const fakeId = '613a1fd12f82f0a12bc90b12'; // Non-existent ID
    const partialUpdate = {
      name: 'Non-existent User',
    };

    const res = await request(app)
      .patch(`/users/${fakeId}`)
      .send(partialUpdate)
      .expect(404);

  });
});

describe('DELETE /users/:id', function () {
  it('should delete a user by id', async () => {
    const user = await User.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: 'password123',
    });

    await request(app)
      .delete(`/users/${user._id}`)
      .expect(200);

    const userInDb = await User.findById(user._id);
    expect(userInDb).to.be.null;
  });

  it('should return 404 if trying to delete a non-existent user', async () => {
    const fakeId = '613a1fd12f82f0a12bc90b12'; // Non-existent ID
    const res = await request(app)
      .delete(`/users/${fakeId}`)
      .expect(404);

  });

  it('should return 400 for invalid user ID format in delete', async () => {
    const invalidId = 'invalid-id-format';
    const res = await request(app)
      .delete(`/users/${invalidId}`)
      .expect(400);

  });
});
