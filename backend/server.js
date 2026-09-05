const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
// Port 5001 avoids macOS AirPlay Receiver port 5000 conflict
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'EduQuiz Pro REST API Engine (MongoDB Cluster: edu_pulse_lk_db)',
    timestamp: new Date().toISOString()
  });
});

// API Routes Dispatcher
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Connect to MongoDB and Start Server
const server = app.listen(PORT, async () => {
  console.log(`=============================================================`);
  console.log(`🚀 EduQuiz Pro API Server running on port ${PORT}`);
  console.log(`🔗 API Base Endpoint: http://localhost:${PORT}/api`);
  console.log(`=============================================================`);
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to initialize MongoDB connection on startup:', err.message);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is currently in use by another process.`);
    console.error(`💡 Tip: Close any other terminal running the server, or free port ${PORT}.\n`);
  } else {
    console.error('Server error:', err);
  }
});
