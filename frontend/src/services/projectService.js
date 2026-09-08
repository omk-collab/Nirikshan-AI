import { apiClient, USE_MOCK_DATA, simulateAsync } from './api';
import { mockProjects } from '../data/mockProjects';

export const projectService = {
  async getProjects(filters = {}) {
    if (USE_MOCK_DATA) {
      let filtered = [...mockProjects];
      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.projectId.toLowerCase().includes(q) ||
            p.projectName.toLowerCase().includes(q) ||
            p.state.toLowerCase().includes(q) ||
            p.district.toLowerCase().includes(q) ||
            p.workType.toLowerCase().includes(q)
        );
      }
      if (filters.riskLevel && filters.riskLevel !== 'ALL') {
        filtered = filtered.filter((p) => p.riskLevel === filters.riskLevel);
      }
      if (filters.status && filters.status !== 'ALL') {
        filtered = filtered.filter((p) => p.status === filters.status);
      }
      if (filters.state && filters.state !== 'ALL') {
        filtered = filtered.filter((p) => p.state === filters.state);
      }
      if (filters.workType && filters.workType !== 'ALL') {
        filtered = filtered.filter((p) => p.workType === filters.workType);
      }
      return simulateAsync({
        data: filtered,
        total: filtered.length,
        page: filters.page || 1,
        limit: filters.limit || 10,
      });
    }

    const response = await apiClient.get('/projects', { params: filters });
    return response.data;
  },

  async getProjectById(projectId) {
    if (USE_MOCK_DATA) {
      const project = mockProjects.find(
        (p) => p.projectId.toLowerCase() === projectId.toLowerCase()
      ) || mockProjects[0];
      return simulateAsync(project);
    }

    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data;
  },

  async analyzeProjectRisk(projectId) {
    if (USE_MOCK_DATA) {
      const project = mockProjects.find(
        (p) => p.projectId.toLowerCase() === projectId.toLowerCase()
      ) || mockProjects[0];

      // Return simulated AI risk evaluation
      return simulateAsync({
        projectId: project.projectId,
        overallRisk: project.overallRisk,
        riskLevel: project.riskLevel,
        riskBreakdown: project.riskBreakdown,
        riskReasons: project.riskReasons,
        recommendations: project.recommendations,
        analyzedAt: new Date().toISOString(),
      }, 300);
    }

    const response = await apiClient.post(`/risk/analyze/${projectId}`);
    return response.data;
  },
};
