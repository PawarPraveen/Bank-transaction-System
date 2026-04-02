const mongoose = require('mongoose');

async function connectDB() {
  try {
    // Await the connection directly
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    // Correctly handle the error parameter
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
