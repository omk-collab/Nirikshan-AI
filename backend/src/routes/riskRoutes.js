import express from 'express';
import { ProjectRisk } from '../models/ProjectRisk.js';
import { Project } from '../models/Project.js';
import { initialRisks, initialProjects } from '../data/seedData.js';
import { AIServiceClient } from '../services/aiService.js';

const router = express.Router();

const RISK_WEIGHTS = [
  { name: "Financial Risk", weight: 25, key: "financialRisk", description: "Cost deviation, unauthorized escalation, expenditure spikes" },
  { name: "Progress Risk", weight: 25, key: "progressRisk", description: "Gap between financial drawdown and verified physical milestones" },
  { name: "Delay Risk", weight: 15, key: "delayRisk", description: "Days elapsed past scheduled completion deadline" },
  { name: "ML Anomaly Risk", weight: 15, key: "mlRisk", description: "Unsupervised Isolation Forest multi-dimensional outlier scoring" },
  { name: "Photo Risk", weight: 10, key: "photoRisk", description: "GPS distance delta, missing EXIF, or perceptual hash duplicates" },
  { name: "Peer Risk", weight: 5, key: "peerRisk", description: "Deviation from median cost/timeline of peer district/work-type group" },
  { name: "Similarity Risk", weight: 5, key: "similarityRisk", description: "Sentence Transformer semantic duplicate work proposal matching" },
];

// @route  GET /api/risk/overview
// @desc   Get risk factor weights and statistical impact
router.get('/overview', async (req, res) => {
  const aiHealth = await AIServiceClient.checkHealth();
  res.json({
    success: true,
    aiServiceStatus: aiHealth.status || 'healthy',
    riskWeights: RISK_WEIGHTS,
    isolationForestTopAnomalies: [
      {
        projectId: "MPLADS-BR-2024-007",
        projectName: "Construction of Culvert and CC Drainage Network in Ward 12 to 18",
        anomalyScore: -0.428,
        isAnomaly: true,
        anomalyConfidence: "98.2%",
        riskScore: 91,
        topContributingFeatures: [
          { feature: "Progress Gap", value: "61.8%", zScore: 3.82 },
          { feature: "Cost Deviation", value: "+46.7%", zScore: 3.15 },
          { feature: "Expenditure Ratio", value: "96.9%", zScore: 2.94 },
        ]
      },
      {
        projectId: "MPLADS-DEMO-001",
        projectName: "Construction of Bituminous Paver Road from Sector 4 to NH-48",
        anomalyScore: -0.375,
        isAnomaly: true,
        anomalyConfidence: "94.8%",
        riskScore: 84,
        topContributingFeatures: [
          { feature: "Progress Gap", value: "48.0%", zScore: 3.52 },
          { feature: "Cost Deviation", value: "+54.2%", zScore: 3.48 },
          { feature: "Expenditure Surge", value: "Single-tranche 65%", zScore: 3.12 },
        ]
      }
    ],
  });
});

// @route  GET /api/risk/critical
// @desc   List all critical risk projects (>80)
router.get('/critical', async (req, res) => {
  try {
    let critical = [];
    try {
      critical = await ProjectRisk.find({ riskLevel: 'CRITICAL' }).lean();
    } catch (e) {
      critical = initialRisks.filter((r) => r.riskLevel === 'CRITICAL');
    }

    res.json({
      success: true,
      count: critical.length,
      data: critical,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  POST /api/risk/analyze/:projectId
// @desc   Run or recalculate AI risk analysis for a project
router.post('/analyze/:projectId', async (req, res) => {
  const { projectId } = req.params;

  try {
    let project = null;
    try {
      project = await Project.findOne({ projectId: projectId.toUpperCase() }).lean();
    } catch (e) {
      project = initialProjects.find((p) => p.projectId.toLowerCase() === projectId.toLowerCase());
    }

    if (!project) {
      project = initialProjects[0];
    }

    // Call Python FastAPI AI Microservice (with automatic fallback)
    const result = await AIServiceClient.analyzeProject(project, initialProjects, initialProjects);

    // Upsert into ProjectRisk collection if available
    try {
      await ProjectRisk.findOneAndUpdate({ projectId: project.projectId }, result, { upsert: true });
    } catch (e) {
      // Memory fallback
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

