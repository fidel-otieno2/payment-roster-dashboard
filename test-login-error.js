const { Pool } = require('pg');
const bcrypt = require('bcrypt');
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

async function testLoginLocally() {
  try {
    console.log('🔍 Testing login locally...');

    const email = 'admin@paymentroster.com';
    const password = 'admin123';

    // Check user in database
    console.log('1. Fetching user from database...');
    const result = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);

    if (result.rows.length === 0) {
      console.log('❌ User not found');
      return;
    }

    const user = result.rows[0];
    console.log('✅ User found:', { id: user.id, name: user.name, email: user.email, role: user.role });

    // Check password
    console.log('2. Checking password...');
    if (!user.password) {
      console.log('❌ No password stored in database');
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', validPassword);

    if (validPassword) {
      console.log('✅ Login should work!');
    } else {
      console.log('❌ Password mismatch');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

testLoginLocally();
