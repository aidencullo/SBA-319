import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', getUser, (req, res) => {
  res.json(res.user);
});

router.post('/', async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
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
      res.status(400).json({ message: err.message });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', getUser, async (req, res) => {
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
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', getUser, async (req, res) => {
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
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', getUser, async (req, res) => {
  try {
    await User.deleteOne({ _id: res.user.id });
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    await User.deleteMany();
    res.json({ message: 'All users deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/invalid', async (req, res) => {
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
    res.status(400).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  if (req.params.id.length !== 24) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

export default router;
