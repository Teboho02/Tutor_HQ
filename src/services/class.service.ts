import apiClient from '../config/api';

export interface CreateClassData {
  title: string;
  subject: string;
  description?: string;
  scheduledAt?: string;
  durationMinutes?: number;
  meetingLink?: string;
  studentIds?: string[];
}

export interface UpdateClassData {
  title?: string;
  subject?: string;
  description?: string;
  scheduledAt?: string;
  durationMinutes?: number;
  meetingLink?: string;
  studentIds?: string[];
  status?: string;
}

export const classService = {
  async createClass(data: CreateClassData) {
    const response = await apiClient.post('/classes', data);
    return response.data;
  },

  async getClass(classId: string) {
    const response = await apiClient.get(`/classes/${classId}`);
    return response.data;
  },

  async updateClass(classId: string, data: UpdateClassData) {
    const response = await apiClient.patch(`/classes/${classId}`, data);
    return response.data;
  },

  async listClasses() {
    const response = await apiClient.get('/classes');
    return response.data;
  },

  async cancelClass(classId: number, reason: string) {
    const response = await apiClient.delete(`/classes/${classId}`, {
      data: { reason },
    });
    return response.data;
  },
};
