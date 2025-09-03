const request = require('supertest');
const app = require('../server');

describe('Server API Endpoints', () => {

  describe('GET /', () => {
    it('should return backend running message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain('Backend running');
    });
  });

  describe('POST /api/login', () => {
    it('should return 400 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ email: 'invalid@example.com', password: 'wrong' });
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBe('User not found');
    });

    it('should return 400 if email or password missing', async () => {
      const res = await request(app).post('/api/login').send({});
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /api/register', () => {
    it('should return 400 if required fields missing', async () => {
      const res = await request(app).post('/api/register').send({});
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('Payments endpoints', () => {
    it('should return 401 for unauthenticated payments request', async () => {
      const res = await request(app).get('/api/payments');
      expect(res.statusCode).toEqual(401);
    });

    it('should return 401 for unauthenticated payment creation', async () => {
      const res = await request(app).post('/api/payments').send({});
      expect(res.statusCode).toEqual(401);
    });

    it('should return 401 for unauthenticated payment update', async () => {
      const res = await request(app).put('/api/payments/1').send({});
      expect(res.statusCode).toEqual(401);
    });

    it('should return 401 for unauthenticated payment deletion', async () => {
      const res = await request(app).delete('/api/payments/1');
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('Users endpoints', () => {
    it('should return 401 for unauthenticated users request', async () => {
      const res = await request(app).get('/api/users');
      expect(res.statusCode).toEqual(401);
    });

    it('should return 401 for unauthenticated user role update', async () => {
      const res = await request(app).patch('/api/users/1').send({});
      expect(res.statusCode).toEqual(401);
    });
  });
});
