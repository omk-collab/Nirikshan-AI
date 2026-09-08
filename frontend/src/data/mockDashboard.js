export const mockDashboardSummary = {
  kpis: {
    totalProjects: 1482,
    totalSanctionedAmount: 4825000000, // ₹482.5 Cr
    totalExpenditure: 3612000000,      // ₹361.2 Cr
    completedProjects: 892,
    delayedProjects: 245,
    highRiskProjects: 118,
    criticalProjects: 34,
    averageRiskScore: 42.6,
  },
  riskDistribution: [
    { name: "Low Risk (0-30)", value: 980, color: "#10b981", level: "LOW" },
    { name: "Medium Risk (31-60)", value: 350, color: "#f59e0b", level: "MEDIUM" },
    { name: "High Risk (61-80)", value: 118, color: "#f97316", level: "HIGH" },
    { name: "Critical (81-100)", value: 34, color: "#ef4444", level: "CRITICAL" },
  ],
  projectStatus: [
    { name: "Completed", count: 892, color: "#10b981" },
    { name: "In Progress", count: 345, color: "#3b82f6" },
    { name: "Delayed", count: 245, color: "#f97316" },
    { name: "Pending Review", count: 0, color: "#64748b" },
  ],
  financialVsPhysical: [
    { range: "0-25%", physical: 180, financial: 95 },
    { range: "26-50%", physical: 310, financial: 220 },
    { range: "51-75%", physical: 420, financial: 490 },
    { range: "76-100%", physical: 572, financial: 677 },
  ],
  expenditureTrend: [
    { month: "Apr 23", sanctioned: 380, expenditure: 210 },
    { month: "May 23", sanctioned: 410, expenditure: 260 },
    { month: "Jun 23", sanctioned: 430, expenditure: 290 },
    { month: "Jul 23", sanctioned: 450, expenditure: 320 },
    { month: "Aug 23", sanctioned: 470, expenditure: 360 },
    { month: "Sep 23", sanctioned: 490, expenditure: 400 },
    { month: "Oct 23", sanctioned: 510, expenditure: 430 },
    { month: "Nov 23", sanctioned: 530, expenditure: 460 },
    { month: "Dec 23", sanctioned: 550, expenditure: 500 },
    { month: "Jan 24", sanctioned: 570, expenditure: 530 },
    { month: "Feb 24", sanctioned: 590, expenditure: 560 },
    { month: "Mar 24", sanctioned: 610, expenditure: 590 },
  ],
  stateWiseProjects: [
    { state: "Maharashtra", projects: 264, sanctionedCr: 88.5, criticalCount: 7 },
    { state: "Uttar Pradesh", projects: 312, sanctionedCr: 98.2, criticalCount: 8 },
    { state: "Karnataka", projects: 195, sanctionedCr: 62.4, criticalCount: 5 },
    { state: "Bihar", projects: 182, sanctionedCr: 58.1, criticalCount: 6 },
    { state: "Tamil Nadu", projects: 168, sanctionedCr: 54.0, criticalCount: 3 },
    { state: "Gujarat", projects: 154, sanctionedCr: 51.2, criticalCount: 2 },
    { state: "Rajasthan", projects: 120, sanctionedCr: 41.5, criticalCount: 2 },
    { state: "West Bengal", projects: 87, sanctionedCr: 28.6, criticalCount: 1 },
  ],
  riskTrend: [
    { week: "W1 Jan", low: 960, medium: 340, high: 125, critical: 38 },
    { week: "W2 Jan", low: 965, medium: 342, high: 122, critical: 37 },
    { week: "W3 Jan", low: 970, medium: 345, high: 120, critical: 36 },
    { week: "W4 Jan", low: 974, medium: 348, high: 119, critical: 35 },
    { week: "W1 Feb", low: 978, medium: 350, high: 118, critical: 34 },
  ],
  quickInsights: [
    { id: 1, type: "critical", text: "34 projects flagged with Critical Risk requiring urgent administrative review.", count: 34 },
    { id: 2, type: "warning", text: "118 projects have significant Financial vs Physical Progress gap (>25%).", count: 118 },
    { id: 3, type: "warning", text: "42 projects show severe cost deviation (>30% above engineering estimates).", count: 42 },
    { id: 4, type: "info", text: "245 projects currently delayed beyond their scheduled completion dates.", count: 245 },
    { id: 5, type: "info", text: "19 projects identified with potentially overlapping or duplicate work descriptions.", count: 19 },
    { id: 6, type: "critical", text: "14 photo submissions failed geotag proximity validation (>1.0 km delta).", count: 14 },
  ]
};
