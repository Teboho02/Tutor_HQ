import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/** Lightweight token persistence so the Authorization header works even when
 *  cross-site cookies are blocked by the browser. */
export const tokenStore = {
    getAccessToken: () => localStorage.getItem('access_token'),
    getRefreshToken: () => localStorage.getItem('refresh_token'),
    setTokens: (access: string, refresh: string) => {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
    },
    clear: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },
};

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Still send cookies when possible
});

// Request interceptor — attach Authorization header from stored token
apiClient.interceptors.request.use(
    (config) => {
        const token = tokenStore.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling errors and token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Don't try to refresh for auth endpoints (prevents infinite loop)
        const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

        // Handle 401 Unauthorized — try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true;

            const refreshToken = tokenStore.getRefreshToken();
            if (refreshToken) {
                try {
                    const res = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
                    const { access_token, refresh_token: newRefresh } = res.data?.data?.session || {};
                    if (access_token) {
                        tokenStore.setTokens(access_token, newRefresh || refreshToken);
                        originalRequest.headers.Authorization = `Bearer ${access_token}`;
                        return apiClient(originalRequest);
                    }
                } catch {
                    tokenStore.clear();
                }
            }

            // Refresh failed — redirect to login
            if (!window.location.pathname.includes('/login')) {
                tokenStore.clear();
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
