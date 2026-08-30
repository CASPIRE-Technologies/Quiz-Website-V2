/* ==========================================================================
   MYSQL DATABASE CONNECTION & POOL MANAGEMENT
   ========================================================================== */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'quiz_platform_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test Connection Helper
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL Database:', process.env.DB_NAME || 'quiz_platform_db');
    connection.release();
    return true;
  } catch (error) {
    console.warn('⚠️ MySQL connection failed:', error.message);
    console.warn('👉 Operating in Fallback Data Mode for local testing without MySQL daemon.');
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};
