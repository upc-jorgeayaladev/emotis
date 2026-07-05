const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Possible causes:');
    console.error('  1. Cluster is paused (go to MongoDB Atlas → cluster → "Resume")');
    console.error('  2. IP address not whitelisted (Atlas → Network Access → add 0.0.0.0/0)');
    console.error('  3. Invalid credentials in MONGODB_URI');
    process.exit(1);
  }
};

module.exports = connectDB;
