import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'nirikshan_production_jwt_secret_2026_key';
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    secret,
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
    const isDbConnected = mongoose.connection.readyState === 1;
    let user = null;

    if (isDbConnected) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        if (user.status && user.status !== 'ACTIVE') {
          return res.status(403).json({ success: false, message: 'Account is deactivated. Please contact administrator.' });
        }
        user.lastLogin = new Date();
        await user.save().catch(() => {});
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }

    // In non-database fallback mode (testing/demo without MongoDB running):
    if (!user) {
      const mockUserList = [
        {
          id: 'USR-001',
          name: 'Dr. Arvind Subramanian',
          email: 'admin@example.com',
          role: 'MINISTRY_ADMIN',
          department: 'Ministry of Statistics & Programme Implementation (MoSPI)',
          state: 'National (All States)',
          district: 'All Districts',
        },
        {
          id: 'USR-002',
          name: 'Smt. Rohini Sharma, IAS',
          email: 'state.mh@example.com',
          role: 'STATE_AUTHORITY',
          department: 'Planning & Development Department, Govt of Maharashtra',
          state: 'Maharashtra',
          district: 'State Headquarters',
        },
        {
          id: 'USR-003',
          name: 'Shri Rajeshwar Rao, IAS',
          email: 'dc.pune@example.com',
          role: 'DISTRICT_AUTHORITY',
          department: 'District Collectorate & Planning Cell',
          state: 'Maharashtra',
          district: 'Pune',
        },
        {
          id: 'USR-004',
          name: 'Er. Ramesh Kulkarni',
          email: 'ee.pwd@example.com',
          role: 'OFFICER',
          department: 'Executive Engineer, Public Works Division II',
          state: 'Maharashtra',
          district: 'Pune',
        },
        {
          id: 'USR-005',
          name: 'Priya Sundaram',
          email: 'analyst@example.com',
          role: 'ANALYST',
          department: 'National Risk Intelligence & Audit Unit',
          state: 'National',
          district: 'All Districts',
        },
        {
          id: 'USR-006',
          name: 'Vikramaditya Rathore',
          email: 'officer.up@example.com',
          role: 'OFFICER',
          department: 'Superintending Engineer, Jal Nigam',
          state: 'Uttar Pradesh',
          district: 'Varanasi',
        },
      ];

      const matched = mockUserList.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (matched && password === 'password123') {
        user = {
          _id: matched.id,
          ...matched,
        };
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        state: user.state,
        district: user.district,
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
