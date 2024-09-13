import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, // Regex for email validation
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024, // Hashing may produce longer strings
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the current date
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// Middleware to update `updatedAt` on every save
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('users', userSchema);
