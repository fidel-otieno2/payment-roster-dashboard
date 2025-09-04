// Test database connection script
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log("Testing database connection...");
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_DATABASE:", process.env.DB_DATABASE);
    console.log("DB_USER:", process.env.DB_USER);
    console.log("DB_PORT:", process.env.DB_PORT);

    const client = await pool.connect();
    console.log("✅ Database connected successfully!");

    const result = await client.query('SELECT COUNT(*) FROM users');
    console.log("Users count:", result.rows[0].count);

    client.release();
    pool.end();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    pool.end();
  }
}

testConnection();
