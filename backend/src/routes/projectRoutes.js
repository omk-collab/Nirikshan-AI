import express from 'express';
import { Project } from '../models/Project.js';
import { ProjectRisk } from '../models/ProjectRisk.js';
import { initialProjects, initialRisks } from '../data/seedData.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper to compute virtual attributes for fallback objects
const enrichProject = (p, risksMap = {}) => {
  const estimated = p.estimatedCost || 1;
  const sanctioned = p.sanctionedAmount || 1;
  const costDev = Number((((p.actualCost - estimated) / estimated) * 100).toFixed(2));
  const expRatio = Number(((p.expenditure / sanctioned) * 100).toFixed(2));
  const gap = Number((p.financialProgress - p.physicalProgress).toFixed(2));
  const risk = risksMap[p.projectId] || {
    overallRisk: costDev > 30 || gap > 25 ? 84 : 22,
    riskLevel: costDev > 30 || gap > 25 ? 'CRITICAL' : 'LOW',
    riskBreakdown: {
      financialRisk: costDev > 20 ? 85 : 15,
      progressRisk: gap > 20 ? 90 : 12,
      delayRisk: p.delayDays > 60 ? 75 : 10,
      mlRisk: 70,
      photoRisk: 65,
      peerRisk: 60,
      similarityRisk: 30,
    },
    riskReasons: [
      `Financial progress (${p.financialProgress}%) vs physical progress (${p.physicalProgress}%)`,
      `Cost deviation computed at +${costDev}% over baseline engineering estimate`,
    ],
    recommendations: [
      'Conduct independent on-site measurement verification by third-party engineer',
      'Audit contractor expenditure milestones before clearing subsequent tranches',
    ],
  };

  return {
    ...p,
    costDeviation: costDev,
    expenditureRatio: expRatio,
    progressGap: gap,
    overallRisk: risk.overallRisk,
    riskLevel: risk.riskLevel,
    riskBreakdown: risk.riskBreakdown,
    riskReasons: risk.riskReasons,
    recommendations: risk.recommendations,
  };
};

// @route  GET /api/projects
// @desc   List projects with multi-parameter filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const { search, riskLevel, state, district, workType, status, sort = 'overallRisk', order = 'desc', page = 1, limit = 50 } = req.query;

    let projects = [];
    try {
      projects = await Project.find({}).lean();
    } catch (e) {
      projects = [];
    }

    if (!projects || projects.length === 0) {
      projects = initialProjects;
    }

    // Build risk lookup
    let risksMap = {};
    try {
      const risks = await ProjectRisk.find({}).lean();
      risks.forEach((r) => {
        risksMap[r.projectId] = r;
      });
    } catch (e) {
      initialRisks.forEach((r) => {
        risksMap[r.projectId] = r;
      });
    }

    let enriched = projects.map((p) => enrichProject(p, risksMap));

    // Filter by text search
    if (search) {
      const q = search.toLowerCase();
      enriched = enriched.filter(
        (p) =>
          p.projectId.toLowerCase().includes(q) ||
          p.projectName.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.workType.toLowerCase().includes(q)
      );
    }

    // Filter by riskLevel
    if (riskLevel && riskLevel !== 'ALL') {
      enriched = enriched.filter((p) => p.riskLevel === riskLevel);
    }

    // Filter by state
    if (state && state !== 'ALL') {
      enriched = enriched.filter((p) => p.state === state);
    }

    // Filter by workType
    if (workType && workType !== 'ALL') {
      enriched = enriched.filter((p) => p.workType === workType);
    }

    // Filter by status
    if (status && status !== 'ALL') {
      enriched = enriched.filter((p) => p.status === status);
    }

    // Sorting
    const isAsc = order === 'asc';
    enriched.sort((a, b) => {
      const valA = a[sort] || 0;
      const valB = b[sort] || 0;
      if (typeof valA === 'string') {
        return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return isAsc ? valA - valB : valB - valA;
    });

    const total = enriched.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = enriched.slice(startIndex, startIndex + Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: paginated,
    });
  } catch (error) {
    console.error('Error fetching projects', error);
    res.status(500).json({ success: false, message: 'Server error retrieving projects' });
  }
});

// @route  GET /api/projects/:projectId
// @desc   Get single project dossier by projectId
router.get('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    let project = null;
    try {
      project = await Project.findOne({ projectId: projectId.toUpperCase() }).lean();
    } catch (e) {
      project = null;
    }

    if (!project) {
      project = initialProjects.find(
        (p) => p.projectId.toLowerCase() === projectId.toLowerCase()
      ) || initialProjects[0];
    }

    let risk = null;
    try {
      risk = await ProjectRisk.findOne({ projectId: project.projectId }).lean();
    } catch (e) {
      risk = null;
    }

    const risksMap = risk ? { [project.projectId]: risk } : {};
    initialRisks.forEach((r) => {
      if (!risksMap[r.projectId]) risksMap[r.projectId] = r;
    });

    const enriched = enrichProject(project, risksMap);

    res.json({
      success: true,
      data: enriched,
    });
  } catch (error) {
    console.error('Error getting project', error);
    res.status(500).json({ success: false, message: 'Error retrieving project details' });
  }
});

// @route  POST /api/projects
// @desc   Create new project proposal
router.post('/', protect, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();

    res.status(201).json({
      success: true,
      data: newProject,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
