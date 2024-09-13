import express from 'express';
import Post from '../models/Post.js';

const router = express.Router();

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single post
router.get('/:id', getPost, (req, res) => {
  res.json(res.post);
});

// POST a new post
router.post('/', async (req, res) => {
  const post = new Post({
    name: req.body.name,
    email: req.body.email,
    // Add other fields as necessary
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a post
router.patch('/:id', getPost, async (req, res) => {
  if (req.body.name != null) {
    res.post.name = req.body.name;
  }
  if (req.body.email != null) {
    res.post.email = req.body.email;
  }
  // Update other fields as necessary

  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a post (PUT)
router.put('/:id', getPost, async (req, res) => {
  // Update all fields
  res.post.name = req.body.name;
  res.post.email = req.body.email;
  // Update other fields as necessary

  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a post
router.delete('/:id', getPost, async (req, res) => {
  try {
    await res.post.remove();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE all posts
router.delete('/', async (req, res) => {
  try {
    await Post.deleteMany();
    res.json({ message: 'All posts deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get post by ID
async function getPost(req, res, next) {
  let post;
  try {
    post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: 'Cannot find post' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.post = post;
  next();
}

export default router;
