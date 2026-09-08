import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;
let isMemoryFallback = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nirikshan';
  mongoose.set('bufferCommands', false);

  try {
    console.log(`[DB] Attempting connection to MongoDB: ${uri}...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    isMemoryFallback = false;
    console.log(`[DB] Successfully connected to MongoDB at ${uri}`);
  } catch (error) {
    console.warn(`[DB] Warning: Could not connect to external MongoDB daemon (${error.message}).`);
    console.log(`[DB] Initializing self-contained In-Memory Model Store for development and testing.`);
    isConnected = false;
    isMemoryFallback = true;
  }
};

export const getDBStatus = () => ({
  isConnected,
  isMemoryFallback,
  host: isConnected ? mongoose.connection.host : 'In-Memory State Store',
});
