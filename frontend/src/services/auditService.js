import { apiClient, USE_MOCK_DATA, simulateAsync } from './api';
import { mockAuditLogs } from '../data/mockAuditLogs';

export const auditService = {
  async getAuditLogs() {
    if (USE_MOCK_DATA) {
      return simulateAsync(mockAuditLogs);
    }
    const response = await apiClient.get('/audit-logs');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  async logAction(action, entity, entityId, details) {
    const newLog = {
      id: `LOG-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      user: "Current User",
      role: "MINISTRY_ADMIN",
      action,
      entity,
      entityId,
      details,
      ipAddress: "14.139.128.5",
      timestamp: new Date().toISOString(),
      status: "SUCCESS",
    };
    if (USE_MOCK_DATA) {
      mockAuditLogs.unshift(newLog);
      return simulateAsync(newLog);
    }
    const response = await apiClient.post('/audit-logs', newLog);
    return response.data;
  },
};
