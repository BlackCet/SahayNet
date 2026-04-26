import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn("MONGODB_URI not set. Skipping MongoDB connection.");
      return;
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB Atlas Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    // Don't exit process so the app can still serve fallback data
    // process.exit(1);
  }
};
