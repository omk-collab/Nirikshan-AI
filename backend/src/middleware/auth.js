import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nirikshan_super_secure_jwt_secret_key_2024');

      // Attach user to request
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        // Fallback for demo mock token
        req.user = {
          _id: decoded.id || 'demo_user',
          name: decoded.name || 'Administrative Official',
          email: decoded.email || 'admin@example.com',
          role: decoded.role || 'MINISTRY_ADMIN',
        };
      }
      return next();
    } catch (error) {
      // In dev demo mode, permit requests with demo header
      if (process.env.NODE_ENV === 'development') {
        req.user = {
          _id: 'demo_user',
          name: 'Dr. Arvind Subramanian',
          email: 'admin@example.com',
          role: 'MINISTRY_ADMIN',
        };
        return next();
      }
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  // If in development mode and no token provided, grant mock administrative context
  if (process.env.NODE_ENV === 'development') {
    req.user = {
      _id: 'demo_user',
      name: 'Dr. Arvind Subramanian',
      email: 'admin@example.com',
      role: 'MINISTRY_ADMIN',
    };
    return next();
  }

  return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.role || 'NONE'}) is not authorized to access this resource`,
      });
    }
    next();
  };
};
