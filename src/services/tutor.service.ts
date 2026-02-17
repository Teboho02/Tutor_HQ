import apiClient from '../config/api';

export interface AddStudentData {
  email: string;
  fullName: string;
  phoneNumber?: string;
  gradeLevel?: string;
  schoolName?: string;
  dateOfBirth?: string;
  classId?: string;
}

export interface UpdateStudentData {
  fullName?: string;
  phoneNumber?: string;
  gradeLevel?: string;
  schoolName?: string;
  dateOfBirth?: string;
}

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

  async getMyClasses() {
    const response = await apiClient.get('/tutors/classes');
    return response.data;
  },

  async addStudent(data: AddStudentData) {
    const response = await apiClient.post('/tutors/students', data);
    return response.data;
  },

  async getStudentDetails(studentId: string) {
    const response = await apiClient.get(`/tutors/students/${studentId}`);
    return response.data;
  },

  async updateStudent(studentId: string, data: UpdateStudentData) {
    const response = await apiClient.put(`/tutors/students/${studentId}`, data);
    return response.data;
  },

  async removeStudent(studentId: string) {
    const response = await apiClient.delete(`/tutors/students/${studentId}`);
    return response.data;
  },

  async enrollStudent(studentId: string, classId: string) {
    const response = await apiClient.post(`/tutors/students/${studentId}/enroll`, { classId });
    return response.data;
  },

  async unenrollStudent(studentId: string, classId: string) {
    const response = await apiClient.delete(`/tutors/students/${studentId}/enroll/${classId}`);
    return response.data;
  },
};
