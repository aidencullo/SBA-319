import express from 'express';
import connectDB from './db.js';

import User from './models/User.js';

const app = express();

app.get('/', async (req, res) => {
  const result = await User.create({
    name: 'Test User',
  });
  res.send(result);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
  connectDB();
});
