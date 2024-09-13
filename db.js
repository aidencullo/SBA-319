import mongoose from 'mongoose';
import 'dotenv/config';

const CONNECTION_STRING = process.env.ATLAS_URI;

if (!CONNECTION_STRING) {
  throw new Error('Please provide a connection string');
}

const connect = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
}

export default connect;
