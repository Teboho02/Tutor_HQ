import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { User, RegisterData } from '../services/auth.service';
import { useToast } from '../components/Toast';
import { tokenStore } from '../config/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchCurrentUser = async () => {
        try {
            const response = await authService.getCurrentUser();
            if (response.success) {
                setUser(response.data.user);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const login = async (email: string, password: string): Promise<User> => {
        try {
            const response = await authService.login({ email, password });
            if (response.success) {
                // Persist tokens so the Authorization header works as a cookie fallback
                const session = response.data?.session;
                if (session?.access_token) {
                    tokenStore.setTokens(session.access_token, session.refresh_token || '');
                }
                setUser(response.data.user);
                showToast('Login successful!', 'success');
                return response.data.user;
            }
            throw new Error('Login failed');
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            const message = axiosError.response?.data?.message || 'Login failed';
            showToast(message, 'error');
            throw error;
        }
    };

    const register = async (data: RegisterData) => {
        try {
            const response = await authService.register(data);
            if (response.success) {
                const session = response.data?.session;
                if (session?.access_token) {
                    tokenStore.setTokens(session.access_token, session.refresh_token || '');
                }
                setUser(response.data.user);
                showToast('Registration successful!', 'success');
            }
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            const message = axiosError.response?.data?.message || 'Registration failed';
            showToast(message, 'error');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            tokenStore.clear();
            setUser(null);
            showToast('Logged out successfully', 'info');
        } catch {
            tokenStore.clear();
            setUser(null);
            showToast('Logged out', 'info');
        }
    };

    const refreshUser = async () => {
        await fetchCurrentUser();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};
