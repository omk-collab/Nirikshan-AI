import { apiClient, USE_MOCK_DATA, simulateAsync } from './api';
import { mockAlerts } from '../data/mockAlerts';

let alertsState = [...mockAlerts];

export const alertService = {
  async getAlerts(severity = 'ALL') {
    if (USE_MOCK_DATA) {
      if (severity !== 'ALL') {
        return simulateAsync(alertsState.filter((a) => a.severity === severity));
      }
      return simulateAsync(alertsState);
    }
    const response = await apiClient.get('/alerts', { params: { severity } });
    return response.data;
  },

  async updateAlertStatus(alertId, status) {
    if (USE_MOCK_DATA) {
      alertsState = alertsState.map((a) => (a.id === alertId ? { ...a, status } : a));
      const updated = alertsState.find((a) => a.id === alertId);
      return simulateAsync(updated);
    }
    const response = await apiClient.patch(`/alerts/${alertId}`, { status });
    return response.data;
  },
};
