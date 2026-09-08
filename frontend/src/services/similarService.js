import { apiClient, USE_MOCK_DATA, simulateAsync } from './api';
import { mockSimilarProjects } from '../data/mockSimilarProjects';

export const similarService = {
  async getSimilarProjects() {
    if (USE_MOCK_DATA) {
      return simulateAsync(mockSimilarProjects);
    }
    const response = await apiClient.get('/projects/similar');
    return response.data;
  },
};
