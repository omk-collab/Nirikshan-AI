import { apiClient, USE_MOCK_DATA, simulateAsync } from './api';
import { mockPhotos } from '../data/mockPhotos';

// Haversine distance in meters
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export const photoService = {
  async getPhotos(projectId = null) {
    if (USE_MOCK_DATA) {
      if (projectId) {
        return simulateAsync(mockPhotos.filter((p) => p.projectId === projectId));
      }
      return simulateAsync(mockPhotos);
    }
    const response = await apiClient.get('/photos', { params: { projectId } });
    return response.data;
  },

  async verifyPhoto({ projectLat, projectLng, photoLat, photoLng, threshold = 250 }) {
    if (USE_MOCK_DATA) {
      const distance = calculateHaversineDistance(projectLat, projectLng, photoLat, photoLng);
      const isPass = distance <= threshold;
      return simulateAsync({
        distanceMeters: distance,
        thresholdMeters: threshold,
        gpsStatus: isPass ? "Consistent" : "Requires Review",
        timestampStatus: "Verified",
        overallVerification: isPass ? "PASS" : "FAIL",
        duplicateScore: 14.5,
        message: isPass
          ? `Photo location matches sanctioned project coordinates within ${distance}m (Threshold: ${threshold}m).`
          : `Photo coordinates deviate ${distance}m from site. Requires administrative review.`,
      }, 250);
    }
    const response = await apiClient.post('/photos/verify', { projectLat, projectLng, photoLat, photoLng, threshold });
    return response.data;
  },
};
