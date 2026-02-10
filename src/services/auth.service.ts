import apiClient from '../config/api';

export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
    role: 'student' | 'tutor' | 'parent';
    parentEmails?: string[];
    childEmails?: string[];
}

export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'student' | 'tutor' | 'parent';
    avatarUrl?: string;
    phoneNumber?: string;
}

export const authService = {
    async register(data: RegisterData) {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

    async login(data: LoginData) {
        const response = await apiClient.post('/auth/login', data);
        return response.data;
    },

    async logout() {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    },

    async getCurrentUser() {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    async updateProfile(data: Partial<User>) {
        const response = await apiClient.patch('/auth/profile', data);
        return response.data;
    },

    async changePassword(oldPassword: string, newPassword: string) {
        const response = await apiClient.post('/auth/change-password', {
            currentPassword: oldPassword,
            newPassword,
        });
        return response.data;
    },

    async forgotPassword(email: string) {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    },

    async resetPassword(token: string, newPassword: string) {
        const response = await apiClient.post('/auth/reset-password', {
            token,
            newPassword,
        });
        return response.data;
    },
};
