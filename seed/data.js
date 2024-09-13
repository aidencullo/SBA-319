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
  for (let i = 0; i < 10; i++) {
    await User.create({
      name: 'John Doe',
    });
  }
}; 

const seedComments = async () => {
  await Comment.deleteMany();
  for (let i = 0; i < 10; i++) {
    await Comment.create({
      name: 'John Doe',
    });
  }
}; 

const seedPosts = async () => {
  await Post.deleteMany();
  for (let i = 0; i < 10; i++) {
    await Post.create({
      name: 'John Doe',
    });
  }
}; 



export default seed;
