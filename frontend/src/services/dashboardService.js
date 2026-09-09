import { apiClient, USE_MOCK_DATA, simulateAsync } from './api';
import { mockDashboardSummary } from '../data/mockDashboard';

export const dashboardService = {
  async getSummary() {
    if (USE_MOCK_DATA) {
      return simulateAsync(mockDashboardSummary);
    }
    const response = await apiClient.get('/dashboard/summary');
    return response.data?.data || response.data;
  },

  async getStateWiseDistribution() {
    if (USE_MOCK_DATA) {
      return simulateAsync(mockDashboardSummary.stateWiseProjects);
    }
    const response = await apiClient.get('/dashboard/state-wise');
    return response.data?.data || response.data;
  },

  async getTrends() {
    if (USE_MOCK_DATA) {
      return simulateAsync(mockDashboardSummary.expenditureTrend);
    }
    const response = await apiClient.get('/dashboard/trends');
    return response.data?.data || response.data;
  },
};
