import express from 'express';
import { 
  getAllPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  replacePost, 
  deletePost, 
  deleteAllPosts,
  createInvalidPost,
  validatePost,
} from '../controllers/post.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', validatePost, getPostById);
router.post('/', createPost);
router.patch('/:id', validatePost, updatePost);
router.put('/:id', validatePost, replacePost);
router.delete('/:id', validatePost, deletePost);
router.delete('/', deleteAllPosts);
router.post('/invalid', createInvalidPost);

export default router;
