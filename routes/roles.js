const express = require('express');
const { getAllRoles } = require('../controllers/roleController');

const router = express.Router();

// GET /roles - Get all available roles
router.get('/', getAllRoles);

module.exports = router; 