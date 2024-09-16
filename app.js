import express from 'express';

import user from './routes/user.js';
import post from './routes/post.js';
import comment from './routes/comment.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/users');
});

app.use('/users', user);
app.use('/posts', post);
app.use('/comments', comment);

app.use(errorHandler);

export default app;
