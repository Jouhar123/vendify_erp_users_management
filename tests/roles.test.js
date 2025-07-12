const request = require('supertest');
const app = require('../server');
const { pool } = require('../config/database');

describe('Roles Tests', () => {
  beforeAll(async () => {
    // Ensure test database is set up
    await pool.execute('USE erp_user_management');
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('GET /roles', () => {
    it('should get all available roles', async () => {
      const response = await request(app)
        .get('/roles');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('roles');
      expect(response.body.data).toHaveProperty('total');
      expect(Array.isArray(response.body.data.roles)).toBe(true);
      expect(response.body.data.total).toBeGreaterThan(0);
    });

    it('should return roles with correct structure', async () => {
      const response = await request(app)
        .get('/roles');

      expect(response.status).toBe(200);
      
      const roles = response.body.data.roles;
      expect(roles.length).toBeGreaterThan(0);
      
      // Check structure of first role
      const firstRole = roles[0];
      expect(firstRole).toHaveProperty('id');
      expect(firstRole).toHaveProperty('name');
      expect(firstRole).toHaveProperty('description');
      expect(firstRole).toHaveProperty('permissions');
      expect(firstRole).toHaveProperty('created_at');
      
      // Check that ID is a number
      expect(typeof firstRole.id).toBe('number');
      
      // Check that name is a string
      expect(typeof firstRole.name).toBe('string');
      
      // Check that permissions is an object (JSON)
      expect(typeof firstRole.permissions).toBe('object');
    });

    it('should include all expected role types', async () => {
      const response = await request(app)
        .get('/roles');

      expect(response.status).toBe(200);
      
      const roles = response.body.data.roles;
      const roleNames = roles.map(role => role.name);
      
      // Check for expected roles
      expect(roleNames).toContain('CA'); // Company Admin
      expect(roleNames).toContain('SM'); // Store Manager
      expect(roleNames).toContain('FM'); // Finance Manager
      expect(roleNames).toContain('EM'); // Employee
    });

    it('should return roles in correct order (by ID)', async () => {
      const response = await request(app)
        .get('/roles');

      expect(response.status).toBe(200);
      
      const roles = response.body.data.roles;
      
      // Check that roles are ordered by ID
      for (let i = 1; i < roles.length; i++) {
        expect(roles[i].id).toBeGreaterThan(roles[i-1].id);
      }
    });
  });
}); 