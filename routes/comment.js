import express from 'express';
import { 
  getAllComments, 
  getCommentById, 
  createComment, 
  updateComment, 
  replaceComment, 
  deleteComment, 
  deleteAllComments,
  createInvalidComment,
  validateComment,
} from '../controllers/comment.js';

const router = express.Router();

router.get('/', getAllComments);
router.get('/:id', validateComment, getCommentById);
router.post('/', createComment);
router.patch('/:id', validateComment, updateComment);
router.put('/:id', validateComment, replaceComment);
router.delete('/:id', validateComment, deleteComment);
router.delete('/', deleteAllComments);
router.post('/invalid', createInvalidComment);

export default router;
