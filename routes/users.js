const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { 
  createUser, 
  getAllUsers, 
  getCurrentUser, 
  createUserValidation, 
  paginationValidation 
} = require('../controllers/userController');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// POST /users - Create new user (authentication required)
router.post('/', createUserValidation, createUser);

// GET /users - Get all users (with pagination)
router.get('/', paginationValidation, getAllUsers);

// GET /me - Get current user profile
router.get('/me', getCurrentUser);

module.exports = router; 