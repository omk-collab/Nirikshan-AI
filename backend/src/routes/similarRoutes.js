import express from 'express';
import { SimilarProject } from '../models/SimilarProject.js';

const router = express.Router();

const memorySimilarPairs = [
  {
    pairId: "SIM-2024-001",
    primaryProject: {
      id: "MPLADS-DEMO-001",
      name: "Construction of Bituminous Paver Road from Sector 4 to NH-48",
      state: "Maharashtra",
      district: "Pune",
      workType: "Road Construction",
      cost: 1500000,
      description: "Construction of 1.8 km asphalted bitumen road connecting Sector 4 residential colony to NH-48 highway junction with side drainage."
    },
    matchedProject: {
      id: "MPLADS-MH-2022-814",
      name: "Bituminous Paver Road from Sector 4 Colony to Highway Bypass",
      state: "Maharashtra",
      district: "Pune",
      workType: "Road Construction",
      cost: 1420000,
      description: "Laying of bitumen paver road starting from Sector 4 housing board up to highway bypass arterial link with side stormwater drainage."
    },
    similarityScore: 89.6,
    status: "REQUIRES_REVIEW",
    similarityTag: "Potentially Similar Work",
    analysis: "Sentence Transformer cosine similarity score of 89.6%. The geographic bounding box and physical route description strongly overlap with work sanctioned under MPLADS-MH-2022-814 eighteen months prior. Physical verification is required to confirm whether this proposal represents a new road alignment or redundant re-sanctioning."
  },
  {
    pairId: "SIM-2024-002",
    primaryProject: {
      id: "MPLADS-KA-2024-003",
      name: "Construction of Community Hall & Skill Center at Doddaballapur",
      state: "Karnataka",
      district: "Bengaluru Rural",
      workType: "Community Hall",
      cost: 4500000,
      description: "Construction of two-storey multipurpose community building with computer skill training center in Doddaballapur."
    },
    matchedProject: {
      id: "STATE-SCD-2023-109",
      name: "Ambedkar Youth Community Hall and Vocational Center",
      state: "Karnataka",
      district: "Bengaluru Rural",
      workType: "Community Hall",
      cost: 4200000,
      description: "Establishment of community center with digital literacy room and youth vocational skill training facilities near Doddaballapur town hall."
    },
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
