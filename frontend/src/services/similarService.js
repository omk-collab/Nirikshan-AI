import { apiClient, USE_MOCK_DATA, simulateAsync } from './api';
import { mockSimilarProjects } from '../data/mockSimilarProjects';

export const similarService = {
  async getSimilarProjects() {
    if (USE_MOCK_DATA) {
      return simulateAsync(mockSimilarProjects);
    }
    try {
      const response = await apiClient.get('/similarity');
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    } catch (e) {
      const response = await apiClient.get('/projects/similar');
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    }
  },
};
