import Comment from '../models/Comment.js';
import error from '../utils/error.js';

export async function getAllComments(req, res, next) {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    next(error(500, err.message));
  }
}

export async function getCommentById(req, res, next) {
  res.json(res.comment);
}

export async function validateComment(req, res, next) {
  if (req.params.id.length !== 24) {
    return next(error(400, 'Invalid comment ID'));
  }
  let comment;
  try {
    comment = await Comment.findById(req.params.id);
    if (comment == null) {
      return next(error(404, 'Comment not found'));
    }
  } catch (err) {
    return next(error(500, err.message));
  }

  res.comment = comment;
  next();
}

export async function createComment(req, res, next) {
  const { content, post, author } = req.body;

  try {
    const comment = new Comment({ content, post, author });
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    next(error(400, err.message));
  }
}

export async function updateComment(req, res, next) {
  const { content, post, author } = req.body;

  if (content != null) res.comment.content = content;
  if (post != null) res.comment.post = post;
  if (author != null) res.comment.author = author;

  try {
    const updatedComment = await res.comment.save();
    res.json(updatedComment);
  } catch (err) {
    next(error(400, err.message));
  }
}

export async function replaceComment(req, res, next) {
  const { content, post, author } = req.body;

  res.comment.content = content;
  res.comment.post = post;
  res.comment.author = author;

  try {
    const updatedComment = await res.comment.save();
    res.json(updatedComment);
  } catch (err) {
    next(error(400, err.message));
  }
}

export async function deleteComment(req, res, next) {
  try {
    await Comment.deleteOne({ _id: res.comment.id });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(error(500, err.message));
  }
}

export async function deleteAllComments(req, res, next) {
  try {
    await Comment.deleteMany();
    res.json({ message: 'All comments deleted' });
  } catch (err) {
    next(error(500, err.message));
  }
}

export async function createInvalidComment(req, res, next) {
  const invalidComment = new Comment({
    content: '',
    post: 'invalid-post-id',
    author: 'unknown'
  });

  try {
    const result = await invalidComment.save();
    res.status(201).json(result);
  } catch (err) {
    next(error(400, err.message));
  }
}
