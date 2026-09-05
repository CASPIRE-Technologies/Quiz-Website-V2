/* ==========================================================================
   MONGODB DATABASE CONNECTION & MONGOOSE MANAGEMENT
   ========================================================================== */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://localhost:27017/edu_pulse_lk_db';

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      dbName: 'edu_pulse_lk_db',
      serverSelectionTimeoutMS: 10000
    });
    isConnected = true;
    console.log(`✅ Connected to MongoDB Atlas Cluster: ${conn.connection.name} (${conn.connection.host})`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
}

async function testConnection() {
  try {
    await connectDB();
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  connectDB,
  testConnection,
  mongoose
};
