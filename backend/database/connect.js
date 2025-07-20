const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URL;
    
    if (!mongoURI) {
      throw new Error("❌ MONGO_URL is not defined in environment variables");
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit the app if DB connection fails
  }
};

module.exports = connectDB;
