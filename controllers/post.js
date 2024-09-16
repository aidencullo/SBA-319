import Post from '../models/Post.js';
import error from '../utils/error.js';

export async function getAllPosts(req, res, next) {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    next(error(500, err.message));
  }
}

export async function getPostById(req, res, next) {
  res.json(res.post);
}

export async function validatePost(req, res, next) {
  if (req.params.id.length !== 24) {
    return next(error(400, 'Invalid post ID'));
  }
  let post;
  try {
    post = await Post.findById(req.params.id);
    if (post == null) {
      return next(error(404, 'Post not found'));
    }
  } catch (err) {
    return next(error(500, err.message));
  }

  res.post = post;
  next();
}

export async function createPost(req, res, next) {
  const { name, content, author } = req.body;

  try {
    const post = new Post({ name, content, author });
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    next(error(400, err.message));
  }
}

export async function updatePost(req, res, next) {
  const { name, content, author } = req.body;

  if (name != null) res.post.name = name;
  if (content != null) res.post.content = content;
  if (author != null) res.post.author = author;

  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    next(error(400, err.message));
  }
}

export async function replacePost(req, res, next) {
  const { name, content, author } = req.body;

  res.post.name = name;
  res.post.content = content;
  res.post.author = author;

  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    next(error(400, err.message));
  }
}

export async function deletePost(req, res, next) {
  try {
    await Post.deleteOne({ _id: res.post.id });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(error(500, err.message));
  }
}

export async function deleteAllPosts(req, res, next) {
  try {
    await Post.deleteMany();
    res.json({ message: 'All posts deleted' });
  } catch (err) {
    next(error(500, err.message));
  }
}

export async function createInvalidPost(req, res, next) {
  const invalidPost = new Post({
    name: '',
    content: 'short',
    author: 'unknown'
  });

  try {
    const result = await invalidPost.save();
    res.status(201).json(result);
  } catch (err) {
    next(error(400, err.message));
  }
}
