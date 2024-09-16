import express from 'express';
import Post from '../models/Post.js';
import error from '../utils/error.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    next(error(500, err.message));
  }
});

router.get('/:id', getPost, (req, res) => {
  res.json(res.post);
});

router.post('/', async (req, res, next) => {
  const post = new Post({
    name: req.body.name,
    content: req.body.content,
    author: req.body.author,
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    next(error(400, err.message));
  }
});

router.patch('/:id', getPost, async (req, res, next) => {
  if (req.body.name != null) {
    res.post.name = req.body.name;
  }
  if (req.body.content != null) {
    res.post.content = req.body.content;
  }
  if (req.body.author != null) {
    res.post.author = req.body.author;
  }

  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    next(error(400, err.message));
  }
});

router.put('/:id', getPost, async (req, res, next) => {
  res.post.name = req.body.name;
  res.post.content = req.body.content;
  res.post.author = req.body.author;

  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    next(error(400, err.message));
  }
});

router.delete('/:id', getPost, async (req, res, next) => {
  try {
    await Post.deleteOne({ _id: res.post.id });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(error(500, err.message));
  }
});

router.delete('/', async (req, res, next) => {
  try {
    await Post.deleteMany();
    res.json({ message: 'All posts deleted' });
  } catch (err) {
    next(error(500, err.message));
  }
});

async function getPost(req, res, next) {
  if (req.params.id.length !== 24) {
    return next(error(400, 'Invalid post ID'));
  }
  let post;
  try {
    post = await Post.findById(req.params.id);
    if (post == null) {
      return next(error(404, 'Cannot find post'));
    }
  } catch (err) {
    return next(error(500, err.message));
  }

  res.post = post;
  next();
}

export default router;
