import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { connectDb, disconnectDb } from '../db/connect.js';

describe('GET /comments', function () {
  it('should return an empty array when no comments exist', (done) => {
    request(app)
      .get('/comments')
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

describe('POST /comments', function () {
  it('should create a new comment with content, author, and post', async () => {
    const newPost = await Post.create({
      name: 'Post Name',
      content: 'This is a post content.',
      author: 'John Doe',
    });      
    
    const newComment = {
      content: 'This is a comment.',
      author: 'Jane Doe',
      post: newPost._id,
    };

    const res = await request(app)
      .post('/comments')
      .send(newComment)
      .expect(201);

    expect(res.body).to.have.property('content', 'This is a comment.');
    expect(res.body).to.have.property('author', 'Jane Doe');
    expect(res.body).to.have.property('post', newPost._id.toString());

    const commentInDb = await Comment.findOne({ content: 'This is a comment.' });
    expect(commentInDb).to.not.be.null;
    expect(commentInDb).to.have.property('content', 'This is a comment.');
    expect(commentInDb).to.have.property('author', 'Jane Doe');
  });

  it('should return 400 if required fields are missing', async () => {
    const incompleteComment = {
      content: 'This is a comment.',
    };

    await request(app)
      .post('/comments')
      .send(incompleteComment)
      .expect(400);
  });

  it('should return 400 if post ID is invalid', async () => {
    const invalidPostComment = {
      content: 'This is a comment.',
      author: 'Jane Doe',
      post: 'invalid-post-id',
    };

    await request(app)
      .post('/comments')
      .send(invalidPostComment)
      .expect(400);
  });
});

describe('GET /comments/:id', function () {
  it('should return a comment by id', async () => {
    const comment = await Comment.create({
      content: 'This is a comment.',
      author: 'Jane Doe',
      post: '603c6a905dbf3c001f648b2b',
    });

    const res = await request(app)
      .get(`/comments/${comment._id}`)
      .expect(200);

    expect(res.body).to.have.property('content', 'This is a comment.');
    expect(res.body).to.have.property('author', 'Jane Doe');
  });

  it('should return 404 if comment is not found', async () => {
    const fakeId = '613a1fd12f82f0a12bc90b12'; // Non-existent ID
    await request(app)
      .get(`/comments/${fakeId}`)
      .expect(404);
  });

  it('should return 400 for invalid comment ID format', async () => {
    const invalidId = 'invalid-id-format';
    await request(app)
      .get(`/comments/${invalidId}`)
      .expect(400);
  });
});

describe('PUT /comments/:id', function () {
  it('should update an existing comment', async () => {
    const comment = await Comment.create({
      content: 'This is a comment.',
      author: 'Jane Doe',
      post: '603c6a905dbf3c001f648b2b',
    });

    const updatedComment = {
      content: 'Updated comment content.',
      author: 'John Doe',
      post: '603c6a905dbf3c001f648b2b',
    };

    const res = await request(app)
      .put(`/comments/${comment._id}`)
      .send(updatedComment)
      .expect(200);

    expect(res.body).to.have.property('content', 'Updated comment content.');
    expect(res.body).to.have.property('author', 'John Doe');

    const commentInDb = await Comment.findById(comment._id);
    expect(commentInDb).to.have.property('content', 'Updated comment content.');
    expect(commentInDb).to.have.property('author', 'John Doe');
  });

  it('should return 400 if required fields are missing in update', async () => {
    const comment = await Comment.create({
      content: 'This is a comment.',
      author: 'Jane Doe',
      post: '603c6a905dbf3c001f648b2b',
    });

    const incompleteUpdate = {
      author: 'Updated Author',
    };

    await request(app)
      .put(`/comments/${comment._id}`)
      .send(incompleteUpdate)
      .expect(400);
  });

  it('should return 404 if trying to update a non-existent comment', async () => {
    const fakeId = '613a1fd12f82f0a12bc90b12'; // Non-existent ID
    const updatedComment = {
      content: 'Updated comment content.',
      author: 'John Doe',
      post: '603c6a905dbf3c001f648b2b',
    };

    await request(app)
      .put(`/comments/${fakeId}`)
      .send(updatedComment)
      .expect(404);
  });
});

describe('PATCH /comments/:id', function () {
  it('should partially update an existing comment', async () => {
    const comment = await Comment.create({
      content: 'This is a comment.',
      author: 'Jane Doe',
      post: '603c6a905dbf3c001f648b2b',
    });

    const partialUpdate = {
      content: 'Partially updated comment content.',
    };

    const res = await request(app)
      .patch(`/comments/${comment._id}`)
      .send(partialUpdate)
      .expect(200);

    expect(res.body).to.have.property('content', 'Partially updated comment content.');
    expect(res.body).to.have.property('author', 'Jane Doe');

    const commentInDb = await Comment.findById(comment._id);
    expect(commentInDb).to.have.property('content', 'Partially updated comment content.');
    expect(commentInDb).to.have.property('author', 'Jane Doe');
  });

  it('should return 404 if trying to partially update a non-existent comment', async () => {
    const fakeId = '613a1fd12f82f0a12bc90b12'; // Non-existent ID
    const partialUpdate = {
      content: 'Non-existent comment update.',
    };

    await request(app)
      .patch(`/comments/${fakeId}`)
      .send(partialUpdate)
      .expect(404);
  });
});

describe('DELETE /comments/:id', function () {
  it('should delete a comment by id', async () => {
    const comment = await Comment.create({
      content: 'This is a comment.',
      author: 'Jane Doe',
      post: '603c6a905dbf3c001f648b2b',
    });

    await request(app)
      .delete(`/comments/${comment._id}`)
      .expect(200);

    const commentInDb = await Comment.findById(comment._id);
    expect(commentInDb).to.be.null;
  });

  it('should return 404 if trying to delete a non-existent comment', async () => {
    const fakeId = '613a1fd12f82f0a12bc90b12'; // Non-existent ID
    await request(app)
      .delete(`/comments/${fakeId}`)
      .expect(404);
  });

  it('should return 400 for invalid comment ID format in delete', async () => {
    const invalidId = 'invalid-id-format';
    await request(app)
      .delete(`/comments/${invalidId}`)
      .expect(400);
  });
});
