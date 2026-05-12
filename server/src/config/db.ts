import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from the root directory since the user put it there
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGOURI;
    if (!mongoUri) {
      console.error('Error: MONGOURI is not defined in the .env file');
      process.exit(1);
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
