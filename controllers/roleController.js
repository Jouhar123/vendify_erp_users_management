const { pool } = require('../config/database');

// Get all available roles
const getAllRoles = async (req, res) => {
  try {
    const [roles] = await pool.execute(
      'SELECT id, name, description, permissions, created_at FROM roles ORDER BY id'
    );

    res.json({
      success: true,
      message: 'Roles retrieved successfully',
      data: {
        roles,
        total: roles.length
      }
    });

  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllRoles
}; 