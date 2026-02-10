import apiClient from '../config/api';

export const tutorService = {
  async getDashboard() {
    const response = await apiClient.get('/tutors/dashboard');
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get('/tutors/profile');
    return response.data;
  },

  async getStudents() {
    const response = await apiClient.get('/tutors/students');
    return response.data;
  },

  async getSchedule() {
    const response = await apiClient.get('/tutors/schedule');
    return response.data;
  },
};
