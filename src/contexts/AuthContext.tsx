import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, SignupData, LoginData } from '../api';

interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'student' | 'tutor' | 'parent' | 'admin';
    avatar_url?: string;
    bio?: string;
    roleData?: any;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginData) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage and verify with server
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (authApi.isAuthenticated()) {
                    // Try to get current user from server
                    const currentUser = await authApi.getCurrentUser();
                    setUser(currentUser);
                }
            } catch (error) {
                console.error('Failed to initialize auth:', error);
                // Clear invalid tokens
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (data: LoginData) => {
        try {
            const response = await authApi.login(data);
            setUser(response.user);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const signup = async (data: SignupData) => {
        try {
            const response = await authApi.signup(data);
            setUser(response.user);
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
        }
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const refreshUser = async () => {
        try {
            const currentUser = await authApi.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Failed to refresh user:', error);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// HOC to protect routes
export const withAuth = <P extends object>(
    Component: React.ComponentType<P>,
    requiredRole?: string | string[]
) => {
    return (props: P) => {
        const { user, loading, isAuthenticated } = useAuth();

        if (loading) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}>
                    Loading...
                </div>
            );
        }

        if (!isAuthenticated) {
            window.location.href = '/login';
            return null;
        }

        // Check role if specified
        if (requiredRole && user) {
            const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
            if (!roles.includes(user.role)) {
                return (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        flexDirection: 'column'
                    }}>
                        <h2>Access Denied</h2>
                        <p>You do not have permission to access this page.</p>
                    </div>
                );
            }
        }

        return <Component {...props} />;
    };
};
