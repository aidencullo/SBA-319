import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 1, // Minimum length for a comment
    maxlength: 1000, // Assuming comments can be fairly long
  },
  author: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50, // Similar constraints as in user schema
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'posts', // Reference to the Post model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true, // Comments are active by default
  },
});

// Middleware to update `updatedAt` on every save
commentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('comments', commentSchema);
