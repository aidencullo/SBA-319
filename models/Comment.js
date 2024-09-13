import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model('comments', commentSchema);
