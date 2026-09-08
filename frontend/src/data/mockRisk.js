export const mockRiskData = {
  riskWeights: [
    { name: "Financial Risk", weight: 25, key: "financialRisk", description: "Cost deviation, unauthorized escalation, expenditure spikes" },
    { name: "Progress Risk", weight: 25, key: "progressRisk", description: "Gap between financial drawdown and verified physical milestones" },
    { name: "Delay Risk", weight: 15, key: "delayRisk", description: "Days elapsed past scheduled completion deadline" },
    { name: "ML Anomaly Risk", weight: 15, key: "mlRisk", description: "Unsupervised Isolation Forest multi-dimensional outlier scoring" },
    { name: "Photo Risk", weight: 10, key: "photoRisk", description: "GPS distance delta, missing EXIF, or perceptual hash duplicates" },
    { name: "Peer Risk", weight: 5, key: "peerRisk", description: "Deviation from median cost/timeline of peer district/work-type group" },
    { name: "Similarity Risk", weight: 5, key: "similarityRisk", description: "Sentence Transformer semantic duplicate work proposal matching" },
  ],
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
      projectId: "MPLADS-OD-2024-012",
      projectName: "Deep Tube Wells and Community Overhead Water Reservoirs",
      anomalyScore: -0.392,
      isAnomaly: true,
      anomalyConfidence: "95.6%",
      riskScore: 87,
      topContributingFeatures: [
        { feature: "Progress Gap", value: "46.7%", zScore: 3.41 },
        { feature: "Delay Days", value: "130 days", zScore: 2.85 },
        { feature: "Cost Deviation", value: "+31.1%", zScore: 2.45 },
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
    },
    {
      projectId: "MPLADS-PB-2024-015",
      projectName: "Construction of Stormwater Drainage and Underground Sewerage Pipe Line",
      anomalyScore: -0.341,
      isAnomaly: true,
      anomalyConfidence: "92.1%",
      riskScore: 82,
      topContributingFeatures: [
        { feature: "Progress Gap", value: "40.0%", zScore: 3.05 },
        { feature: "Cost Deviation", value: "+35.3%", zScore: 2.70 },
      ]
    },
    {
      projectId: "MPLADS-TN-2024-006",
      projectName: "Construction of Additional Classrooms & Smart Labs",
      anomalyScore: -0.315,
      isAnomaly: true,
      anomalyConfidence: "89.4%",
      riskScore: 79,
      topContributingFeatures: [
        { feature: "Progress Gap", value: "34.2%", zScore: 2.68 },
        { feature: "Delay Days", value: "140 days", zScore: 2.92 },
      ]
    },
  ],
  riskFactorImpactAnalysis: [
    { factor: "Financial/Physical Gap > 30%", affectedProjects: 118, averageRiskIncrease: "+28 pts" },
    { factor: "Cost Escalation > 25%", affectedProjects: 76, averageRiskIncrease: "+22 pts" },
    { factor: "Delay > 90 Days", affectedProjects: 142, averageRiskIncrease: "+18 pts" },
    { factor: "Geotag Proximity Delta > 500m", affectedProjects: 31, averageRiskIncrease: "+25 pts" },
    { factor: "Semantic Proposal Overlap > 80%", affectedProjects: 19, averageRiskIncrease: "+15 pts" },
  ]
};
