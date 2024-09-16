import express from 'express';
import { 
  getUsers, 
  getUser, 
  createUser, 
  updateUser, 
  replaceUser, 
  deleteUser, 
  deleteAllUsers, 
  createInvalidUser,
  validateUser,
} from '../controllers/user.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', validateUser, getUser);
router.post('/', createUser);
router.patch('/:id', validateUser, updateUser);
router.put('/:id', validateUser, replaceUser);
router.delete('/:id', validateUser, deleteUser);
router.delete('/', deleteAllUsers);
router.post('/invalid', createInvalidUser);

export default router;
