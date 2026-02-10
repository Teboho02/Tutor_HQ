import apiClient from '../config/api';

export const parentService = {
  async linkChild(childEmail: string) {
    const response = await apiClient.post('/parents/children', { childEmail });
    return response.data;
  },

  async unlinkChild(childId: string) {
    const response = await apiClient.delete(`/parents/children/${childId}`);
    return response.data;
  },

  async getChildren() {
    const response = await apiClient.get('/parents/children');
    return response.data;
  },

  async getChildPerformance(childId: string) {
    const response = await apiClient.get(`/parents/children/${childId}/performance`);
    return response.data;
  },

  async getChildSchedule(childId: string) {
    const response = await apiClient.get(`/parents/children/${childId}/schedule`);
    return response.data;
  },

  async getChildAttendance(childId: string) {
    const response = await apiClient.get(`/parents/children/${childId}/attendance`);
    return response.data;
  },

  async getDashboard() {
    const response = await apiClient.get('/parents/dashboard');
    return response.data;
  },
};
