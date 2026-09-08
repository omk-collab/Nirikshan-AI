import express from 'express';
import { Alert } from '../models/Alert.js';
import { initialAlerts } from '../data/seedData.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// In-memory fallback array for status updates if DB is in memory mode
let memoryAlerts = [...initialAlerts];

// @route  GET /api/alerts
// @desc   List alerts with severity filter
router.get('/', async (req, res) => {
  try {
    const { severity } = req.query;
    let alerts = [];

    try {
      const query = severity && severity !== 'ALL' ? { severity } : {};
      alerts = await Alert.find(query).sort({ timestamp: -1 }).lean();
    } catch (e) {
      alerts = [];
    }

    if (!alerts || alerts.length === 0) {
      alerts = severity && severity !== 'ALL'
        ? memoryAlerts.filter((a) => a.severity === severity)
        : memoryAlerts;
    }

    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  PATCH /api/alerts/:alertId
// @desc   Update alert status (NEW, REVIEWING, RESOLVED, DISMISSED)
router.patch('/:alertId', protect, async (req, res) => {
  const { alertId } = req.params;
  const { status } = req.body;

  try {
    let updated = null;
    try {
      updated = await Alert.findOneAndUpdate(
        { alertId },
        { status, resolvedBy: req.user?.name, resolvedAt: new Date() },
        { new: true }
      );
    } catch (e) {
      // Memory fallback
    }

    if (!updated) {
      memoryAlerts = memoryAlerts.map((a) =>
        a.alertId === alertId ? { ...a, status, resolvedBy: req.user?.name, resolvedAt: new Date() } : a
      );
      updated = memoryAlerts.find((a) => a.alertId === alertId);
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
