import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important: enables cookies for authentication
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add any custom headers here if needed
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling errors and token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await apiClient.post('/auth/refresh');
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Redirect to login if refresh fails
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
