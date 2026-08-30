/* ==========================================================================
   DATABASE CONNECTION & POOL MANAGEMENT
   ========================================================================== */

const mysql = require('mysql2/promise');
const { Pool: PgPool } = require('pg');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;
const hasSupabasePostgresUrl =
  databaseUrl &&
  databaseUrl.startsWith('postgres') &&
  !databaseUrl.includes('[YOUR-PASSWORD]');

let pool;

function toPostgresQuery(sql, params = []) {
  let index = 0;
  const text = sql.replace(/\?/g, () => `$${++index}`);
  return { text, values: params };
}

if (hasSupabasePostgresUrl) {
  const pgPool = new PgPool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    max: Number(process.env.DB_POOL_SIZE || 10),
    connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS || 8000)
  });

  pool = {
    async query(sql, params = []) {
      const result = await pgPool.query(toPostgresQuery(sql, params));
      return [result.rows, result];
    },
    async getConnection() {
      const client = await pgPool.connect();
      return {
        async query(sql, params = []) {
          const result = await client.query(toPostgresQuery(sql, params));
          return [result.rows, result];
        },
        release() {
          client.release();
        }
      };
    }
  };
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'quiz_platform_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

// Test Connection Helper
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    const dbLabel = hasSupabasePostgresUrl
      ? 'Supabase PostgreSQL Database'
      : `MySQL Database: ${process.env.DB_NAME || 'quiz_platform_db'}`;
    console.log('✅ Connected to', dbLabel);
    connection.release();
    return true;
  } catch (error) {
    console.warn('⚠️ Database connection failed:', error.message);
    if (!hasSupabasePostgresUrl && databaseUrl && databaseUrl.includes('[YOUR-PASSWORD]')) {
      console.warn('👉 Replace [YOUR-PASSWORD] in DATABASE_URL with your Supabase database password.');
    }
    console.warn('👉 Operating in Fallback Data Mode for local testing without a live database.');
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};
