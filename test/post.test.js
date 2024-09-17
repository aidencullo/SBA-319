import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js'; // Adjust the path as necessary
import Post from '../models/Post.js';
import { connectDb, disconnectDb } from '../db/connect.js';

describe('GET /posts', function () {
  it('should return an empty array when no posts exist', (done) => {
    request(app)
      .get('/posts')
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

describe('POST /posts', function () {
  it('should create a new post with name, content, and author', async () => {
    const newPost = {
      name: 'My First Post',
      content: 'This is the content of the post.',
      author: 'John Doe',
    };

    const res = await request(app)
      .post('/posts')
      .send(newPost)
      .expect(201);

    expect(res.body).to.have.property('name', 'My First Post');
    expect(res.body).to.have.property('content', 'This is the content of the post.');
    expect(res.body).to.have.property('author', 'John Doe');

    const postInDb = await Post.findOne({ name: 'My First Post' });
    expect(postInDb).to.not.be.null;
    expect(postInDb).to.have.property('name', 'My First Post');
    expect(postInDb).to.have.property('content', 'This is the content of the post.');
    expect(postInDb).to.have.property('author', 'John Doe');
  });

  it('should return 400 if required fields are missing', async () => {
    const incompletePost = {
      name: 'Incomplete Post',
      // content and author are missing
    };

    const res = await request(app)
      .post('/posts')
      .send(incompletePost)
      .expect(400);

  });

  it('should return 400 if content is too short', async () => {
    const invalidContentPost = {
      name: 'Short Content Post',
      content: 'Too short',
      author: 'John Doe',
    };

    const res = await request(app)
      .post('/posts')
      .send(invalidContentPost)
      .expect(400);

  });
});

describe('GET /posts/:id', function () {
  it('should return a post by id', async () => {
    const post = await Post.create({
      name: 'Sample Post',
      content: 'This is a sample post content.',
      author: 'Jane Doe',
    });

    const res = await request(app)
      .get(`/posts/${post._id}`)
      .expect(200);

    expect(res.body).to.have.property('name', 'Sample Post');
    expect(res.body).to.have.property('content', 'This is a sample post content.');
    expect(res.body).to.have.property('author', 'Jane Doe');
  });

  it('should return 404 if post is not found', async () => {
    const fakeId = '613a1fd12f82f0a12bc90b12'; // Non-existent ID
    const res = await request(app)
      .get(`/posts/${fakeId}`)
      .expect(404);

  });

  it('should return 400 for invalid post ID format', async () => {
    const invalidId = 'invalid-id-format';
    const res = await request(app)
      .get(`/posts/${invalidId}`)
      .expect(400);

  });
});

describe('PUT /posts/:id', function () {
  it('should update an existing post', async () => {
    const post = await Post.create({
      name: 'Update Test Post',
      content: 'Old content.',
      author: 'John Doe',
    });

    const updatedPost = {
      name: 'Updated Post Name',
      content: 'Updated content.',
      author: 'Jane Doe',
    };

    const res = await request(app)
      .put(`/posts/${post._id}`)
      .send(updatedPost)
      .expect(200);

    expect(res.body).to.have.property('name', 'Updated Post Name');
    expect(res.body).to.have.property('content', 'Updated content.');
    expect(res.body).to.have.property('author', 'Jane Doe');

    const postInDb = await Post.findById(post._id);
    expect(postInDb).to.have.property('name', 'Updated Post Name');
    expect(postInDb).to.have.property('content', 'Updated content.');
    expect(postInDb).to.have.property('author', 'Jane Doe');
  });

  it('should return 400 if required fields are missing in update', async () => {
    const post = await Post.create({
      name: 'Update Test Post',
      content: 'Old content.',
      author: 'John Doe',
    });

    const incompleteUpdate = {
      content: 'Updated content.',
      // name and author are missing
    };

    const res = await request(app)
      .put(`/posts/${post._id}`)
      .send(incompleteUpdate)
      .expect(400);

  });

  it('should return 404 if trying to update a non-existent post', async () => {
    const fakeId = '613a1fd12f82f0a12bc90b12'; // Non-existent ID
    const updatedPost = {
      name: 'Non-existent Post',
      content: 'This should not be saved.',
      author: 'John Doe',
    };

    const res = await request(app)
      .put(`/posts/${fakeId}`)
      .send(updatedPost)
      .expect(404);

  });
});

describe('PATCH /posts/:id', function () {
  it('should partially update an existing post', async () => {
    const post = await Post.create({
      name: 'Partial Update Post',
      content: 'Original content.',
      author: 'Jane Doe',
    });

    const partialUpdate = {
      name: 'Updated Name',
    };

    const res = await request(app)
      .patch(`/posts/${post._id}`)
      .send(partialUpdate)
      .expect(200);

    expect(res.body).to.have.property('name', 'Updated Name');
    expect(res.body).to.have.property('content', 'Original content.'); // Content remains unchanged
    expect(res.body).to.have.property('author', 'Jane Doe');

    const postInDb = await Post.findById(post._id);
    expect(postInDb).to.have.property('name', 'Updated Name');
    expect(postInDb).to.have.property('content', 'Original content.');
    expect(postInDb).to.have.property('author', 'Jane Doe');
  });

  it('should return 404 if trying to partially update a non-existent post', async () => {
    const fakeId = '613a1fd12f82f0a12bc90b12'; // Non-existent ID
    const partialUpdate = {
      name: 'Non-existent Post',
    };

    const res = await request(app)
      .patch(`/posts/${fakeId}`)
      .send(partialUpdate)
      .expect(404);

  });
});

describe('DELETE /posts/:id', function () {
  it('should delete a post by id', async () => {
    const post = await Post.create({
      name: 'Delete Test Post',
      content: 'Content to be deleted.',
      author: 'John Doe',
    });

    await request(app)
      .delete(`/posts/${post._id}`)
      .expect(200);

    const postInDb = await Post.findById(post._id);
    expect(postInDb).to.be.null;
  });

  it('should return 404 if trying to delete a non-existent post', async () => {
    const fakeId = '613a1fd12f82f0a12bc90b12'; // Non-existent ID
    const res = await request(app)
      .delete(`/posts/${fakeId}`)
      .expect(404);

  });

  it('should return 400 for invalid post ID format in delete', async () => {
    const invalidId = 'invalid-id-format';
    const res = await request(app)
      .delete(`/posts/${invalidId}`)
      .expect(400);

  });
});
