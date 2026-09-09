import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  const secret = process.env.JWT_SECRET || 'nirikshan_production_jwt_secret_2026_key';

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, secret);

      // Try finding user in database if available
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (e) {
        req.user = null;
      }

      if (!req.user) {
        // Fallback for valid token payload when running without DB instance
        req.user = {
          _id: decoded.id || 'demo_user',
          name: decoded.name || 'Administrative Official',
          email: decoded.email || 'admin@example.com',
          role: decoded.role || 'MINISTRY_ADMIN',
        };
      }

      if (req.user.status && req.user.status !== 'ACTIVE') {
        return res.status(403).json({ success: false, message: 'User account is deactivated' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid or expired token' });
    }
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
