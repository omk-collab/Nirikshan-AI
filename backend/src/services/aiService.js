import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

export class AIServiceClient {
  static async checkHealth() {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/ai/health`, { timeout: 2000 });
      return response.data;
    } catch (error) {
      return { status: 'offline', message: 'FastAPI microservice offline, using Node fallback' };
    }
  }

  static async analyzeProject(projectData, peerProjects = [], similarCorpus = []) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/ai/analyze-project`, {
        ...projectData,
        peerProjects,
        similarCorpus
      }, { timeout: 3000 });

      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn(`[Backend AI Service] FastAPI call failed (${error.message}). Using local Node risk engine fallback.`);
    }

    // Fallback heuristic calculations matching Section 35 of implementation.md
    const estimated = projectData.estimatedCost || projectData.sanctionedAmount || 1;
    const actual = projectData.actualCost || 0;
    const costDev = estimated > 0 && actual > 0 ? ((actual - estimated) / estimated) * 100 : 0;
    const gap = (projectData.financialProgress || 0) - (projectData.physicalProgress || 0);
    const delay = projectData.delayDays || 0;

    const financialRisk = Math.min(100, Math.max(10, Math.round(costDev * 1.5)));
    const progressRisk = Math.min(100, Math.max(10, Math.round(gap * 1.8)));
    const delayRisk = Math.min(100, Math.max(5, Math.round((delay / 120) * 80)));
    const mlRisk = gap > 30 || costDev > 30 ? 85 : 25;
    const photoRisk = gap > 35 ? 75 : 20;
    const peerRisk = costDev > 25 ? 72 : 18;
    const similarityRisk = 30;

    const overallRisk = Math.round(
      financialRisk * 0.25 +
      progressRisk * 0.25 +
      delayRisk * 0.15 +
      mlRisk * 0.15 +
      photoRisk * 0.10 +
      peerRisk * 0.05 +
      similarityRisk * 0.05
    );

    const riskLevel = overallRisk > 80 ? 'CRITICAL' : overallRisk > 60 ? 'HIGH' : overallRisk > 30 ? 'MEDIUM' : 'LOW';

    return {
      projectId: projectData.projectId,
      financialRisk,
      progressRisk,
      delayRisk,
      mlRisk,
      photoRisk,
      peerRisk,
      similarityRisk,
      overallRisk,
      riskLevel,
      indicators: [
        { indicator: 'PROGRESS_MISMATCH', severity: gap > 30 ? 'CRITICAL' : 'HIGH', value: `${gap.toFixed(1)}%`, message: 'Financial progress exceeds physical progress' }
      ],
      reasons: [
        `Progress gap of ${gap.toFixed(1)}% between financial disbursal and physical work.`,
        `Cost deviation of ${costDev.toFixed(1)}% compared to estimated cost.`
      ],
      recommendations: [
        'Perform physical site inspection to verify work completion.',
        'Review financial voucher logs for expenditure authorization.'
      ]
    };
  }
}
