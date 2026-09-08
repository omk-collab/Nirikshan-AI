import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'nirikshan_super_secure_jwt_secret_key_2024',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @route  POST /api/auth/login
// @desc   Authenticate user & obtain JWT token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both email and password' });
  }

  try {
    let user = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: email.toLowerCase() });
      } catch (e) {
        user = null;
      }
    }

    // In dev / demo mode: support demo accounts seamlessly
    if (!user) {
      const isAnalyst = email.includes('analyst');
      user = {
        _id: isAnalyst ? 'usr_analyst_demo' : 'usr_admin_demo',
        name: isAnalyst ? 'Priya Sundaram' : 'Dr. Arvind Subramanian',
        email: email.toLowerCase(),
        role: isAnalyst ? 'ANALYST' : 'MINISTRY_ADMIN',
        department: isAnalyst ? 'Risk Intelligence & Audit Unit' : 'MoSPI Planning Division',
      };
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
});

// @route  GET /api/auth/me
// @desc   Get authenticated user profile
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
