import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitlife';
    
    const options = {
      retryWrites: true,
      w: 'majority',
    };
    
    await mongoose.connect(mongoURI, options);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('💡 If you\'re having connection issues, try using a local MongoDB instance:');
    console.log('   MONGODB_URI=mongodb://localhost:27017/fitlife');
    process.exit(1);
  }
};