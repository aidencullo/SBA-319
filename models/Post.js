import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    minlength: 3,
    maxlength: 100, // Assuming post names/titles might be longer
  },
  content: {
    type: String,
    required: true,
    minlength: 10, // Minimum length for content
  },
  author: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50, // Similar constraints to the user schema
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isPublished: {
    type: Boolean,
    default: false, // Assume posts are unpublished by default
  },
});

// Middleware to update `updatedAt` on every save
postSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('posts', postSchema);
