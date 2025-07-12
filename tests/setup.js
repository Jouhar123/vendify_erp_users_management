// Test setup file
require('dotenv').config();

// Set test environment
process.env.NODE_ENV = 'test';

// Increase timeout for database operations
jest.setTimeout(10000);

// Global test utilities
global.testUtils = {
  // Helper to create test user data
  createTestUser: (overrides = {}) => ({
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    first_name: 'Test',
    last_name: 'User',
    role_id: 2,
    ...overrides
  }),

  // Helper to get auth token
  getAuthToken: async (app, email = 'admin@techcorp.com', password = 'password123') => {
    const response = await require('supertest')(app)
      .post('/auth/login')
      .send({ email, password });
    
    return response.body.data?.token;
  }
}; 