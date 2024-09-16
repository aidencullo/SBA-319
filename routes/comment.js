import express from 'express';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import error from '../utils/error.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    next(error(500, err.message));
  }
});

router.get('/:id', getComment, (req, res) => {
  res.json(res.comment);
});

router.post('/', async (req, res, next) => {
  if (req.body.post == null || req.body.post.length !== 24) {
    return next(error(400, 'Invalid post ID'));
  }

  const response = await Post.findById(req.body.post);

  if (await Post.findById(req.body.post) == null) {
    return next(error(400, 'Invalid post ID'));
  }

  const comment = new Comment({
    content: req.body.content,
    author: req.body.author,
    post: req.body.post,
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    next(error(400, err.message));
  }
});

router.patch('/:id', getComment, async (req, res, next) => {
  if (req.body.content != null) {
    res.comment.content = req.body.content;
  }
  if (req.body.author != null) {
    res.comment.author = req.body.author;
  }
  if (req.body.post != null) {
    res.comment.post = req.body.post;
  }

  try {
    const updatedComment = await res.comment.save();
    res.json(updatedComment);
  } catch (err) {
    next(error(400, err.message));
  }
});

router.put('/:id', getComment, async (req, res, next) => {
  res.comment.content = req.body.content;
  res.comment.author = req.body.author;
  res.comment.post = req.body.post;

  try {
    const updatedComment = await res.comment.save();
    res.json(updatedComment);
  } catch (err) {
    next(error(400, err.message));
  }
});

router.delete('/:id', getComment, async (req, res, next) => {
  try {
    await Comment.deleteOne({ _id: res.comment.id });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(error(500, err.message));
  }
});

router.delete('/', async (req, res, next) => {
  try {
    await Comment.deleteMany();
    res.json({ message: 'All comments deleted' });
  } catch (err) {
    next(error(500, err.message));
  }
});

async function getComment(req, res, next) {
  if (req.params.id.length !== 24) {
    return next(error(400, 'Invalid comment ID'));
  }
  let comment;
  try {
    comment = await Comment.findById(req.params.id);
    if (comment == null) {
      return next(error(404, 'Cannot find comment'));
    }
  } catch (err) {
    return next(error(500, err.message));
  }

  res.comment = comment;
  next();
}

export default router;
