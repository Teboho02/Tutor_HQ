import apiClient from '../config/api';

export const studentService = {
  async getDashboard() {
    const response = await apiClient.get('/students/dashboard');
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get('/students/profile');
    return response.data;
  },

  async getSchedule() {
    const response = await apiClient.get('/students/schedule');
    return response.data;
  },

  async getAttendance() {
    const response = await apiClient.get('/students/attendance');
    return response.data;
  },
};
