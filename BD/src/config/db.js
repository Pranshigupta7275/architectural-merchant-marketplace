// src/config/db.js

import dns from 'node:dns';
import mongoose from 'mongoose';

// Fix Node.js DNS resolution for MongoDB Atlas
dns.setServers([
  '8.8.8.8',
  '8.8.4.4',
  '1.1.1.1',
  '1.0.0.1',
]);

const connectDB = async () => {
  try {
    console.log('DNS servers:', dns.getServers());

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export default connectDB;