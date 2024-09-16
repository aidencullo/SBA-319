import express from 'express';
import bcrypt from 'bcrypt';

import User from '../models/User.js';
import error from '../utils/error.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    return next(error(500, err.message));
  }
});

router.get('/:id', getUser, (req, res) => {
  res.json(res.user);
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    if (!password || password.length < 6) {
      return next(error(400, 'Password must be at least 6 characters long'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    try {
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (err) {
      return next(error(400, err.message));
    }
  } catch (err) {
    return next(error(500, err.message));
  }
});

router.patch('/:id', getUser, async (req, res, next) => {
  const { name, email, password, isAdmin } = req.body;

  if (name != null) {
    res.user.name = name;
  }
  if (email != null) {
    res.user.email = email;
  }
  if (password != null) {
    res.user.password = await bcrypt.hash(password, 10);
  }
  if (isAdmin != null) {
    res.user.isAdmin = isAdmin;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    return next(error(400, err.message));
  }
});

router.put('/:id', getUser, async (req, res, next) => {
  const { name, email, password, isAdmin } = req.body;

  res.user.name = name;
  res.user.email = email;

  if (password != null) {
    res.user.password = await bcrypt.hash(password, 10);
  }

  res.user.isAdmin = isAdmin || res.user.isAdmin;

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    return next(error(400, err.message));
  }
});

router.delete('/:id', getUser, async (req, res, next) => {
  try {
    await User.deleteOne({ _id: res.user.id });
    res.json({ message: 'User deleted' });
  } catch (err) {
    return next(error(500, err.message));
  }
});

router.delete('/', async (req, res, next) => {
  try {
    await User.deleteMany();
    res.json({ message: 'All users deleted' });
  } catch (err) {
    return next(error(500, err.message));
  }
});

router.post('/invalid', async (req, res, next) => {
  const invalidUser = new User({
    name: '',
    email: 'invalid-email',
    password: 'short',
    isAdmin: 'notabool'
  });

  try {
    const result = await invalidUser.save();
    res.status(201).json(result);
  } catch (err) {
    return next(error(400, err.message));
  }
});

async function getUser(req, res, next) {
  if (req.params.id.length !== 24) {
    return next(error(400, 'Invalid user ID'));
  }
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return next(error(404, 'User not found'));
    }
  } catch (err) {
    return next(error(500, err.message));
  }

  res.user = user;
  next();
}

export default router;
