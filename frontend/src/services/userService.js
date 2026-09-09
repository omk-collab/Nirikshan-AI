import { apiClient, USE_MOCK_DATA, simulateAsync } from './api';
import { mockUsers } from '../data/mockUsers';

export const userService = {
  async getUsers() {
    if (USE_MOCK_DATA) {
      return simulateAsync(mockUsers);
    }
    const response = await apiClient.get('/users');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  getCurrentUser() {
    const saved = localStorage.getItem('nirikshan_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return mockUsers[0]; // Default Ministry Admin
  },

  setCurrentUser(user) {
    localStorage.setItem('nirikshan_user', JSON.stringify(user));
  },
};
