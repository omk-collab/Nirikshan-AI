import { apiClient, USE_MOCK_DATA, simulateAsync } from './api';
import { mockRiskData } from '../data/mockRisk';
import { mockProjects } from '../data/mockProjects';

export const riskService = {
  async getRiskOverview() {
    if (USE_MOCK_DATA) {
      return simulateAsync(mockRiskData);
    }
    const response = await apiClient.get('/risk/overview');
    return response.data;
  },

  async getCriticalProjects() {
    if (USE_MOCK_DATA) {
      const critical = mockProjects.filter((p) => p.riskLevel === 'CRITICAL' || p.riskLevel === 'HIGH');
      return simulateAsync(critical);
    }
    const response = await apiClient.get('/risk/critical');
    return response.data;
  },

  async getIsolationForestAnomalies() {
    if (USE_MOCK_DATA) {
      return simulateAsync(mockRiskData.isolationForestTopAnomalies);
    }
    const response = await apiClient.get('/risk/anomalies');
    return response.data;
  },
};
