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

async function fixAdminPassword() {
  try {
    console.log('🔧 Fixing admin password...');

    // Hash the password
    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log('✅ Password hashed successfully');

    // Update admin user password
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING id, name, email',
      [hashedPassword, 'admin@paymentroster.com']
    );

    if (result.rows.length > 0) {
      console.log('✅ Admin password updated successfully');
      console.log('Admin user:', result.rows[0]);
    } else {
      console.log('❌ Admin user not found');
    }

  } catch (error) {
    console.error('❌ Failed to fix admin password:', error.message);
  } finally {
    await pool.end();
  }
}

fixAdminPassword();
