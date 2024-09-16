import { faker } from '@faker-js/faker';

import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

const seed = async () => {
  await seedUsers();
  await seedPosts();
  await seedComments();
  console.log('Data Seeded');
};

const seedUsers = async () => {
  await User.deleteMany();
  const randomUsers = [];
  for (let i = 0; i < 10; i++) {
    const randomUser = new User({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      isAdmin: faker.datatype.boolean(),
    });
    randomUsers.push(randomUser);
  }
  await User.insertMany(randomUsers);
};

const seedPosts = async () => {
  await Post.deleteMany();
  const randomPosts = [];
  for (let i = 0; i < 10; i++) {
    const randomPost = new Post({
      name: faker.lorem.words(3),
      content: faker.lorem.paragraph(),
      author: faker.person.fullName(),
    });
    randomPosts.push(randomPost);
  }
  await Post.insertMany(randomPosts);
};

const seedComments = async () => {
  await Comment.deleteMany();
  const posts = await Post.find();
  const randomComments = [];
  for (let i = 0; i < 10; i++) {
    const randomComment = new Comment({
      content: faker.lorem.sentence(),
      author: faker.person.fullName(),
      post: faker.helpers.arrayElement(posts)._id,
    });
    randomComments.push(randomComment);
  }
  await Comment.insertMany(randomComments);
};

export default seed;
