import apiClient from '../config/api';

export interface CreateTestData {
  title: string;
  classId: string;
  description?: string;
  scheduledAt?: string;
  dueDate?: string;
  duration?: number;
  totalMarks?: number;
  passingMarks?: number;
  questions?: Array<{
    id: string;
    type: string;
    content: { text: string; image?: string };
    points: number;
    options?: Array<{ id: string; text: string; isCorrect?: boolean }>;
    correctAnswer?: string;
  }>;
}

export interface TestAnswers {
  questionId: string;
  answer: string | string[] | number;
}

export const testService = {
  async createTest(data: CreateTestData) {
    const response = await apiClient.post('/tests', data);
    return response.data;
  },

  async getTutorTests() {
    const response = await apiClient.get('/tests/tutor/all');
    return response.data;
  },

  async getTest(testId: string) {
    const response = await apiClient.get(`/tests/${testId}`);
    return response.data;
  },

  async submitTest(testId: string, answers: TestAnswers[]) {
    const response = await apiClient.post(`/tests/${testId}/submit`, { answers });
    return response.data;
  },

  async getStudentResults(studentId: string) {
    const response = await apiClient.get(`/tests/student/${studentId}`);
    return response.data;
  },

  async getClassResults(classId: string) {
    const response = await apiClient.get(`/tests/class/${classId}`);
    return response.data;
  },

  async uploadQuestionImage(file: File): Promise<{ imageUrl: string; fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/tests/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  async deleteQuestionImage(fileName: string) {
    const response = await apiClient.post('/tests/delete-image', { fileName });
    return response.data;
  },
};
