import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
});

export default mongoose.model('posts', postSchema);
