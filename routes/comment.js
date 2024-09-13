import express from 'express';
import Comment from '../models/Comment.js';

const router = express.Router();

// GET all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single comment
router.get('/:id', getComment, (req, res) => {
  res.json(res.comment);
});

// POST a new comment
router.post('/', async (req, res) => {
  const comment = new Comment({
    name: req.body.name,
    email: req.body.email,
    // Add other fields as necessary
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a comment
router.patch('/:id', getComment, async (req, res) => {
  if (req.body.name != null) {
    res.comment.name = req.body.name;
  }
  if (req.body.email != null) {
    res.comment.email = req.body.email;
  }
  // Update other fields as necessary

  try {
    const updatedComment = await res.comment.save();
    res.json(updatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a comment (PUT)
router.put('/:id', getComment, async (req, res) => {
  // Update all fields
  res.comment.name = req.body.name;
  res.comment.email = req.body.email;
  // Update other fields as necessary

  try {
    const updatedComment = await res.comment.save();
    res.json(updatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a comment
router.delete('/:id', getComment, async (req, res) => {
  try {
    await res.comment.remove();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get comment by ID
async function getComment(req, res, next) {
  let comment;
  try {
    comment = await Comment.findById(req.params.id);
    if (comment == null) {
      return res.status(404).json({ message: 'Cannot find comment' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.comment = comment;
  next();
}

export default router;
