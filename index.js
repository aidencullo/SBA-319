import express from 'express';
import connectDB from './db.js';

import User from './models/User.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';

const app = express();

app.get('/', async (req, res) => {
  const user = User.create({
    name: 'Test User',
  });
  const post = Post.create({
    name: 'Test Post',
  });
  const comment = Comment.create({
    name: 'Test Comment',
  });
  const result = await Promise.all([user, post, comment]);
  res.send(result);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
  connectDB();
});
