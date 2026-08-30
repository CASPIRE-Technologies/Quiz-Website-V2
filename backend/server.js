/* ==========================================================================
   EXPRESS REST API SERVER ENTRYPOINT
   Paid Quiz & Examination Platform
   ========================================================================== */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/db');

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
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'EduQuiz Pro REST API Engine',
    timestamp: new Date().toISOString()
  });
});

// API Routes Dispatcher
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Start Server
app.listen(PORT, async () => {
  console.log(`=============================================================`);
  console.log(`🚀 EduQuiz Pro API Server running on port ${PORT}`);
  console.log(`🔗 API Base Endpoint: http://localhost:${PORT}/api`);
  console.log(`=============================================================`);
  await testConnection();
});
