const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');
const app = express();

app.use(express.json());
app.use('/api', authRoutes);

describe('Auth API Endpoints', () => {
  it('should return 400 if email is missing in forgot-password', async () => {
    const res = await request(app).post('/api/forgot-password').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Email is required');
  });

  it('should return 404 if user not found in forgot-password', async () => {
    const res = await request(app).post('/api/forgot-password').send({ email: 'nonexistent@example.com' });
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBe('User not found');
  });

  it('should return 400 if required fields missing in reset-password', async () => {
    const res = await request(app).post('/api/reset-password').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Email, token and new password are required');
  });

  // Additional tests for reset-password can be added here
});
