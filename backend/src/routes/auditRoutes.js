import express from 'express';
import { AuditLog } from '../models/AuditLog.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

let memoryAuditLogs = [
  {
    logId: "LOG-2024-0982",
    user: "Dr. Arvind Subramanian (admin@example.com)",
    role: "MINISTRY_ADMIN",
    action: "RISK_ENGINE_RECALCULATE",
    entity: "Project Risk Engine",
    entityId: "MPLADS-DEMO-001",
    details: "Triggered multi-factor risk recalculation; updated score to 84 (CRITICAL)",
    ipAddress: "14.139.128.5",
    timestamp: new Date("2024-03-03T08:24:10Z"),
    status: "SUCCESS"
  },
  {
    logId: "LOG-2024-0980",
    user: "Priya Sundaram (analyst@example.com)",
    role: "ANALYST",
    action: "PHOTO_VERIFICATION_EVALUATED",
    entity: "ProjectPhoto",
    entityId: "PHT-2024-003",
    details: "Evaluated EXIF coordinates delta (4,210m); flagged status as FAIL",
    ipAddress: "115.240.90.12",
    timestamp: new Date("2024-03-02T16:15:33Z"),
    status: "SUCCESS"
  }
];

// @route  GET /api/audit-logs
// @desc   List governance compliance audit logs
router.get('/', async (req, res) => {
  try {
    const { action } = req.query;
    let logs = [];

    try {
      const query = action && action !== 'ALL' ? { action } : {};
      logs = await AuditLog.find(query).sort({ timestamp: -1 }).lean();
    } catch (e) {
      logs = [];
    }

    if (!logs || logs.length === 0) {
      logs = action && action !== 'ALL'
        ? memoryAuditLogs.filter((l) => l.action === action)
        : memoryAuditLogs;
    }

    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  POST /api/audit-logs
// @desc   Log new administrative action
router.post('/', protect, async (req, res) => {
  try {
    const { action, entity, entityId, details } = req.body;
    const newLog = {
      logId: `LOG-${Date.now()}`,
      user: req.user?.email || 'Administrator',
      role: req.user?.role || 'MINISTRY_ADMIN',
      action,
      entity,
      entityId,
      details,
      ipAddress: req.ip || '127.0.0.1',
      timestamp: new Date(),
      status: 'SUCCESS',
    };

    try {
      const log = new AuditLog(newLog);
      await log.save();
    } catch (e) {
      memoryAuditLogs.unshift(newLog);
    }

    res.status(201).json({
      success: true,
      data: newLog,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
