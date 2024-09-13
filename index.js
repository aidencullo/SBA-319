import express from 'express';
import connectDB from './db.js';

import user from './routes/user.js';
import post from './routes/post.js';
import comment from './routes/comment.js';

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
  res.redirect('/users');
});

app.use('/users', user);
app.use('/posts', post);
app.use('/comments', comment);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
  connectDB();
});
