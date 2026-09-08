export const mockSimilarProjects = [
  {
    pairId: "SIM-2024-001",
    primaryProject: {
      id: "MPLADS-DEMO-001",
      name: "Construction of Bituminous Paver Road from Sector 4 to NH-48",
      state: "Maharashtra",
      district: "Pune",
      workType: "Road Construction",
      cost: 1500000,
      description: "Construction of 1.8 km asphalted bitumen road connecting Sector 4 residential colony to NH-48 highway junction with side drainage and stone pitching."
    },
    matchedProject: {
      id: "MPLADS-MH-2022-814",
      name: "Bituminous Paver Road from Sector 4 Colony to Highway Bypass",
      state: "Maharashtra",
      district: "Pune",
      workType: "Road Construction",
      cost: 1420000,
      description: "Laying of bitumen paver road starting from Sector 4 housing board up to highway bypass arterial link with concrete side stormwater drainage."
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
      description: "Construction of two-storey multipurpose community building with computer skill training center, drinking water facility, and sanitary blocks in Doddaballapur."
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
  },
  {
    pairId: "SIM-2024-003",
    primaryProject: {
      id: "MPLADS-BR-2024-007",
      name: "Construction of Culvert and CC Drainage Network in Ward 12 to 18",
      state: "Bihar",
      district: "Patna",
      workType: "Drainage & Sanitation",
      cost: 3200000,
      description: "Construction of RCC box culvert across stormwater nallah and pre-cast concrete drainage channels covering Wards 12 through 18."
    },
    matchedProject: {
      id: "NMCG-PAT-2023-044",
      name: "Stormwater Drain Interception & Concrete Box Culvert Work",
      state: "Bihar",
      district: "Patna",
      workType: "Drainage & Sanitation",
      cost: 3800000,
      description: "Deep interception box drain and culverts along municipal drainage sector connecting wards 14, 15 and 16 to outfall trunk line."
    },
    similarityScore: 81.7,
    status: "REQUIRES_REVIEW",
    similarityTag: "Potentially Similar Work",
    analysis: "Semantic overlap of 81.7% identified between Namami Gange / AMRUT scheme civil work and MPLADS drain sanction. Requires cadastral survey overlay to ensure distinct drainage reaches."
  },
  {
    pairId: "SIM-2024-004",
    primaryProject: {
      id: "MPLADS-RJ-2024-008",
      name: "Setting up of RO Water Purification Plants with Automated ATM Dispensers",
      state: "Rajasthan",
      district: "Jaipur",
      workType: "Drinking Water",
      cost: 2800000,
      description: "Installation of five 1000 LPH reverse osmosis community drinking water plants with smart RFID token dispensing systems."
    },
    matchedProject: {
      id: "CSR-HPCL-2023-221",
      name: "Clean Drinking Water RO ATM Kiosks in Rural Jaipur",
      state: "Rajasthan",
      district: "Jaipur",
      workType: "Drinking Water",
      cost: 2650000,
      description: "Deployment of public RO purification kiosks equipped with automated coin/card water dispensing machines in Gram Panchayats."
    },
    similarityScore: 78.4,
    status: "LOW_RISK",
    similarityTag: "Different Locations Verified",
    analysis: "High technical description similarity (78.4%) due to standard equipment nomenclature; however GPS coordinates confirm disparate Gram Panchayats separated by 34 km. No overlap."
  }
];
