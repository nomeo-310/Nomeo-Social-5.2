import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_DB_URI as string;

export const connectToMongoDB = async() => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(MONGODB_URI)
    console.log('mongodb connection is successful')
  } catch (error) {
    console.log('mongodb connection is unsuccessful', error)
  }
}