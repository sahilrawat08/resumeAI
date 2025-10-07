const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect(200);

      expect(res.body.status).toBe('OK');
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.uptime).toBeDefined();
    });
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(res.body.message).toBe('User registered successfully');
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(userData.email);
    });

    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200);

      expect(res.body.message).toBe('Login successful');
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(credentials.email);
    });

    it('should reject invalid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(400);

      expect(res.body.error).toBe('Invalid credentials');
    });
  });

  describe('File Upload', () => {
    let authToken;

    beforeAll(async () => {
      // Login to get auth token
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      authToken = res.body.token;
    });

    it('should reject upload without authentication', async () => {
      await request(app)
        .post('/api/upload')
        .expect(401);
    });

    it('should reject invalid file types', async () => {
      await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('resume', Buffer.from('test content'), 'test.txt')
        .expect(400);
    });
  });
});
