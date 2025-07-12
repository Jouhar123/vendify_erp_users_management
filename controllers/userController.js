const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { body, validationResult, query } = require('express-validator');

// Create a new user (no authentication required)
const createUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, first_name, last_name, role_id, company_id } = req.body;

    // Check if email already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Verify that the role exists
    const [roles] = await pool.execute(
      'SELECT id FROM roles WHERE id = ?',
      [role_id]
    );

    if (roles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role ID'
      });
    }

    // Verify that the company exists
    const [companies] = await pool.execute(
      'SELECT id FROM companies WHERE id = ?',
      [company_id]
    );

    if (companies.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user (no created_by since no authenticated user)
    const [result] = await pool.execute(
      `INSERT INTO users (email, password, first_name, last_name, company_id, role_id, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, first_name, last_name, company_id, role_id, null]
    );

    // Get the created user details
    const [newUser] = await pool.execute(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.company_id, u.role_id, u.created_by,
              c.name as company_name, r.name as role_name
       FROM users u
       JOIN companies c ON u.company_id = c.id
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser[0]
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all users for the current user's company with pagination
const getAllUsers = async (req, res) => {
  try {
    const currentUser = req.user;
    
    // Debug: Check if currentUser and company_id exist
    if (!currentUser || !currentUser.company_id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM users WHERE company_id = ? AND is_deleted = FALSE',
      [currentUser.company_id]
    );

    const totalUsers = countResult[0].total;
    const totalPages = Math.ceil(totalUsers / limit);

    // Get users with pagination
    const [users] = await pool.execute(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.company_id, u.role_id, 
              u.created_by, u.is_active, u.created_at,
              c.name as company_name, r.name as role_name,
              CONCAT(creator.first_name, ' ', creator.last_name) as created_by_name
       FROM users u
       JOIN companies c ON u.company_id = c.id
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN users creator ON u.created_by = creator.id
       WHERE u.company_id = ? AND u.is_deleted = FALSE
       ORDER BY u.created_at DESC
       LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`,
      [currentUser.company_id]
    );

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_users: totalUsers,
          limit,
          has_next: page < totalPages,
          has_prev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get current user's profile
const getCurrentUser = async (req, res) => {
  try {
    const currentUser = req.user;

    // Get detailed user information
    const [users] = await pool.execute(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.company_id, u.role_id, 
              u.created_by, u.is_active, u.created_at,
              c.name as company_name, r.name as role_name,
              CONCAT(creator.first_name, ' ', creator.last_name) as created_by_name
       FROM users u
       JOIN companies c ON u.company_id = c.id
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN users creator ON u.created_by = creator.id
       WHERE u.id = ?`,
      [currentUser.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User profile retrieved successfully',
      data: users[0]
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Validation rules for creating users
const createUserValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('first_name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name is required and must be less than 100 characters'),
  body('last_name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name is required and must be less than 100 characters'),
  body('role_id')
    .isInt({ min: 1 })
    .withMessage('Valid role ID is required'),
  body('company_id')
    .isInt({ min: 1 })
    .withMessage('Valid company ID is required')
];

// Validation rules for pagination
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

module.exports = {
  createUser,
  getAllUsers,
  getCurrentUser,
  createUserValidation,
  paginationValidation
}; 