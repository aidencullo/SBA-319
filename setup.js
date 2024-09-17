import { connectDb, disconnectDb } from './db/connect.js';
import Comment from './models/Comment.js';
import Post from './models/Post.js';
import User from './models/User.js';

before(async () => {
  await connectDb();
});

after(async function () {
  await disconnectDb();
});

beforeEach(async () => {
  await Comment.deleteMany({});
  await Post.deleteMany({});
  await User.deleteMany({});
});

afterEach(async () => {
  await Comment.deleteMany({});
  await Post.deleteMany({});
  await User.deleteMany({});
});
