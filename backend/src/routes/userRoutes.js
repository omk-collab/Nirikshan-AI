import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

const memoryUsers = [
  {
    _id: "USR-001",
    name: "Dr. Arvind Subramanian",
    email: "admin@example.com",
    role: "MINISTRY_ADMIN",
    department: "Ministry of Statistics & Programme Implementation (MoSPI)",
    state: "National (All States)",
    district: "All Districts",
    status: "ACTIVE",
    lastLogin: new Date("2024-03-03T07:45:12Z"),
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    _id: "USR-005",
    name: "Priya Sundaram",
    email: "analyst@example.com",
    role: "ANALYST",
    department: "National Risk Intelligence & Audit Unit",
    state: "National",
    district: "All Districts",
    status: "ACTIVE",
    lastLogin: new Date("2024-03-03T08:30:10Z"),
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
  }
];

// @route  GET /api/users
// @desc   List all users with RBAC roles
router.get('/', async (req, res) => {
  try {
    let users = [];
    try {
      users = await User.find({}).select('-password').lean();
    } catch (e) {
      users = [];
    }

    if (!users || users.length === 0) {
      users = memoryUsers;
    }

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
