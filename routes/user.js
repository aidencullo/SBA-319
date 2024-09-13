import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt'; // For password hashing

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single user
router.get('/:id', getUser, (req, res) => {
  res.json(res.user);
});

// POST a new user
router.post('/', async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword, // Store the hashed password
    isAdmin: isAdmin || false, // Set to false by default
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a user (PATCH)
router.patch('/:id', getUser, async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  if (name != null) {
    res.user.name = name;
  }
  if (email != null) {
    res.user.email = email;
  }
  if (password != null) {
    // Hash the new password before updating
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

// UPDATE a user (PUT)
router.put('/:id', getUser, async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  // Replace all fields
  res.user.name = name;
  res.user.email = email;

  // If password is provided, hash it
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

// DELETE a user
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE all users
router.delete('/', async (req, res) => {
  try {
    await User.deleteMany();
    res.json({ message: 'All users deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get user by ID
async function getUser(req, res, next) {
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
