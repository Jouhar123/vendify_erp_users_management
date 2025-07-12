const express = require('express');
const { login, loginValidation } = require('../controllers/authController');

const router = express.Router();

// POST /auth/login
router.post('/login', loginValidation, login);

module.exports = router; 