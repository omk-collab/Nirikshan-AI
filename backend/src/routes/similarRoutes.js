import express from 'express';
import { SimilarProject } from '../models/SimilarProject.js';

const router = express.Router();

const memorySimilarPairs = [
  {
    pairId: "SIM-2024-001",
    primaryProjectId: "MPLADS-DEMO-001",
    matchedProjectId: "MPLADS-MH-2022-814",
    similarityScore: 89.6,
    status: "REQUIRES_REVIEW",
    similarityTag: "Potentially Similar Work",
    analysis: "Sentence Transformer cosine similarity score of 89.6%. The geographic bounding box and physical route description strongly overlap with work sanctioned under MPLADS-MH-2022-814 eighteen months prior. Physical verification is required to confirm whether this proposal represents a new road alignment or redundant re-sanctioning."
  },
  {
    pairId: "SIM-2024-002",
    primaryProjectId: "MPLADS-KA-2024-003",
    matchedProjectId: "STATE-SCD-2023-109",
    similarityScore: 84.3,
    status: "REQUIRES_REVIEW",
    similarityTag: "Potentially Similar Work",
    analysis: "Semantic similarity of 84.3%. Potential convergence between State Special Component Plan (SCP) funds and MPLADS allocation for the same municipal parcel. Coordination with District Planning Committee recommended."
  }
];

// @route  GET /api/similarity
// @desc   List project pairs with high semantic overlap
router.get('/', async (req, res) => {
  try {
    let pairs = [];
    try {
      pairs = await SimilarProject.find({}).lean();
    } catch (e) {
      pairs = [];
    }

    if (!pairs || pairs.length === 0) {
      pairs = memorySimilarPairs;
    }

    res.json({
      success: true,
      count: pairs.length,
      data: pairs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
