import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    minlength: 3,
    maxlength: 50,
  },
});

export default mongoose.model('users', userSchema);
