const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user details from database to ensure they still exist and are active
    const [users] = await pool.execute(
      'SELECT id, email, first_name, last_name, company_id, role_id, is_active, is_deleted FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const user = users[0];

    if (user.is_deleted) {
      return res.status(401).json({ 
        success: false, 
        message: 'User account has been deleted' 
      });
    }

    if (!user.is_active) {
      return res.status(401).json({ 
        success: false, 
        message: 'User account is inactive' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Get role name from database
    pool.execute(
      'SELECT name FROM roles WHERE id = ?',
      [req.user.role_id]
    ).then(([roles]) => {
      if (roles.length === 0) {
        return res.status(403).json({ 
          success: false, 
          message: 'Invalid role' 
        });
      }

      const userRole = roles[0].name;
      
      if (userRole !== requiredRole) {
        return res.status(403).json({ 
          success: false, 
          message: `Access denied. Required role: ${requiredRole}` 
        });
      }

      next();
    }).catch(error => {
      console.error('Role check error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    });
  };
};

module.exports = {
  authenticateToken,
  requireRole
}; 