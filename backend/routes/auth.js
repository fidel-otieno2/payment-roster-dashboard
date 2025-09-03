const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const { Pool } = require('pg');
require('dotenv').config();

// Setup PostgreSQL client
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Setup SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

// Test SendGrid connection route
router.get('/test-smtp', async (req, res) => {
  try {
    // SendGrid does not have a verify method, so send a test email to yourself
    const msg = {
      to: process.env.SENDGRID_TEST_TO || 'your-email@example.com',
      from: process.env.SENDGRID_FROM || 'no-reply@paymentroster.com',
      subject: 'Test Email from Payment Roster',
      text: 'This is a test email to verify SendGrid setup.',
    };
    await sgMail.send(msg);
    res.json({ message: 'SendGrid test email sent successfully' });
  } catch (error) {
    console.error('SendGrid connection error:', error);
    res.status(500).json({ error: 'SendGrid connection failed', details: error.message });
  }
});

// POST /api/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const result = await pool.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = result.rows[0].id;

    // Generate reset token and expiry (1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store token and expiry in DB (add columns reset_token, reset_token_expiry to users table)
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
      [resetToken, resetTokenExpiry, userId]
    );

    // Send email with reset link
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM || 'no-reply@paymentroster.com',
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
      html: `<p>You requested a password reset.</p><p>Click the link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
    };

    await sgMail.send(msg);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/reset-password
router.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) {
    return res.status(400).json({ error: 'Email, token and new password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, reset_token, reset_token_expiry FROM users WHERE email = $1 LIMIT 1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    if (user.reset_token !== token || new Date() > new Date(user.reset_token_expiry)) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token fields
    await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


