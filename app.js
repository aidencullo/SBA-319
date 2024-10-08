import express from 'express';

import user from './routes/user.js';
import post from './routes/post.js';
import comment from './routes/comment.js';
import errorHandler from './middleware/errorHandler.js';
import error from './utils/error.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/users');
});

app.use('/users', user);
app.use('/posts', post);
app.use('/comments', comment);

app.use((req, res, next) => {
  return next(error(404, 'Not Found'));
});

app.use(errorHandler);

export default app;
