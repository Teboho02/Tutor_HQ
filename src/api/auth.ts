import apiClient, { handleApiError } from './client';

export interface SignupData {
    email: string;
    password: string;
    fullName: string;
    role: 'student' | 'tutor' | 'parent' | 'admin';
    // Student specific
    gradeLevel?: string;
    school?: string;
    learningGoals?: string;
    parentId?: string;
    // Tutor specific
    subjects?: string[];
    qualifications?: string;
    experienceYears?: number;
    hourlyRate?: number;
    availability?: Record<string, any>;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    user: any;
    session: {
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
    };
}

// Authentication API Services
export const authApi = {
    /**
     * Sign up a new user
     */
    signup: async (data: SignupData): Promise<AuthResponse> => {
        try {
            const response = await apiClient.post('/auth/signup', data);

            // Store tokens
            if (response.data.session) {
                localStorage.setItem('access_token', response.data.session.access_token);
                localStorage.setItem('refresh_token', response.data.session.refresh_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Login user
     */
    login: async (data: LoginData): Promise<AuthResponse> => {
        try {
            const response = await apiClient.post('/auth/login', data);

            // Store tokens
            if (response.data.session) {
                localStorage.setItem('access_token', response.data.session.access_token);
                localStorage.setItem('refresh_token', response.data.session.refresh_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Logout user
     */
    logout: async (): Promise<void> => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage regardless of API response
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
    },

    /**
     * Get current user profile
     */
    getCurrentUser: async () => {
        try {
            const response = await apiClient.get('/auth/me');
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data.user;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Refresh access token
     */
    refreshToken: async (refreshToken: string) => {
        try {
            const response = await apiClient.post('/auth/refresh', { refreshToken });

            if (response.data.session) {
                localStorage.setItem('access_token', response.data.session.access_token);
                if (response.data.session.refresh_token) {
                    localStorage.setItem('refresh_token', response.data.session.refresh_token);
                }
            }

            return response.data.session;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Request password reset
     */
    resetPassword: async (email: string) => {
        try {
            const response = await apiClient.post('/auth/reset-password', { email });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Update password
     */
    updatePassword: async (newPassword: string) => {
        try {
            const response = await apiClient.post('/auth/update-password', { newPassword });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('access_token');
    },

    /**
     * Get stored user data
     */
    getStoredUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
};
