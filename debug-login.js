const { Pool } = require('pg');
require('dotenv').config();

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

async function debugLogin() {
  try {
    console.log('🔍 Debugging login endpoint...');

    // Test database connection
    console.log('1. Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Database connected successfully');

    // Check if users table exists
    console.log('2. Checking if users table exists...');
    const tableResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'users'
      );
    `);
    console.log('Users table exists:', tableResult.rows[0].exists);

    if (tableResult.rows[0].exists) {
      // Check user count
      console.log('3. Checking user count...');
      const userCount = await client.query('SELECT COUNT(*) FROM users');
      console.log('User count:', userCount.rows[0].count);

      // Check admin user
      console.log('4. Checking admin user...');
      const adminUser = await client.query('SELECT id, name, email, role FROM users WHERE email = $1', ['admin@paymentroster.com']);
      console.log('Admin user found:', adminUser.rows.length > 0);
      if (adminUser.rows.length > 0) {
        console.log('Admin user details:', adminUser.rows[0]);
      }

      // Test password comparison
      console.log('5. Testing password comparison...');
      const bcrypt = require('bcrypt');
      const testPassword = 'admin123';
      const hashedPassword = adminUser.rows[0] ? adminUser.rows[0].password : null;

      if (hashedPassword) {
        const isValid = await bcrypt.compare(testPassword, hashedPassword);
        console.log('Password valid:', isValid);
      } else {
        console.log('No hashed password found');
      }
    }

    client.release();
    console.log('✅ Debug completed successfully');

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

debugLogin();
