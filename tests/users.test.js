const request = require('supertest');
const app = require('../server');
const { pool } = require('../config/database');

describe('User Management Tests', () => {
  let adminToken;
  let nonAdminToken;

  beforeAll(async () => {
    // Ensure test database is set up
    await pool.execute('USE erp_user_management');
    
    // Get admin token for testing
    const adminResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@techcorp.com',
        password: 'password123'
      });
    adminToken = adminResponse.body.data.token;

    // Get non-admin token for testing (if we had one)
    // For now, we'll use the same admin token but test role restrictions
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('GET /users/me', () => {
    it('should get current user profile with valid token', async () => {
      const response = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('first_name');
      expect(response.body.data).toHaveProperty('last_name');
      expect(response.body.data).toHaveProperty('company_name');
      expect(response.body.data).toHaveProperty('role_name');
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/users/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /users', () => {
    it('should get all users with pagination', async () => {
      const response = await request(app)
        .get('/users?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('users');
      expect(response.body.data).toHaveProperty('pagination');
      expect(response.body.data.pagination).toHaveProperty('current_page');
      expect(response.body.data.pagination).toHaveProperty('total_pages');
      expect(response.body.data.pagination).toHaveProperty('total_users');
    });

    it('should get users without pagination parameters', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('users');
      expect(response.body.data).toHaveProperty('pagination');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/users');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /users', () => {
    it('should create user successfully with CA role', async () => {
      const newUser = {
        email: 'test@techcorp.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
        role_id: 2 // SM role
      };

      const response = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(newUser.email);
      expect(response.body.data.first_name).toBe(newUser.first_name);
      expect(response.body.data.last_name).toBe(newUser.last_name);
      expect(response.body.data.role_id).toBe(newUser.role_id);
    });

    it('should fail with duplicate email', async () => {
      const newUser = {
        email: 'admin@techcorp.com', // Already exists
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
        role_id: 2
      };

      const response = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email already exists');
    });

    it('should fail with invalid role ID', async () => {
      const newUser = {
        email: 'test2@techcorp.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
        role_id: 999 // Non-existent role
      };

      const response = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid role ID');
    });

    it('should fail with missing required fields', async () => {
      const newUser = {
        email: 'test3@techcorp.com',
        password: 'password123',
        // Missing first_name and last_name
        role_id: 2
      };

      const response = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with short password', async () => {
      const newUser = {
        email: 'test4@techcorp.com',
        password: '123', // Too short
        first_name: 'Test',
        last_name: 'User',
        role_id: 2
      };

      const response = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      const newUser = {
        email: 'test5@techcorp.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
        role_id: 2
      };

      const response = await request(app)
        .post('/users')
        .send(newUser);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
}); 