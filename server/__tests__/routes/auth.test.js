import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock Supabase before importing routes
const mockSupabase = {
    auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
        resetPasswordForEmail: jest.fn(),
        updateUser: jest.fn(),
    },
    from: jest.fn(() => ({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
};

jest.unstable_mockModule('../../config/supabase.js', () => ({
    supabase: mockSupabase,
    verifyToken: jest.fn(),
    getUserWithRoleData: jest.fn(),
}));

const { verifyToken, getUserWithRoleData } = await import('../../config/supabase.js');
const authRoutes = await import('../../routes/auth.js');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes.default);

describe('Auth Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/signup', () => {
        it('should create a new student user', async () => {
            const userData = {
                email: 'student@example.com',
                password: 'securePassword123',
                fullName: 'Test Student',
                role: 'student',
                gradeLevel: '10th',
                school: 'Test High School',
            };

            mockSupabase.auth.signUp.mockResolvedValue({
                data: {
                    user: { id: 'user-123', email: userData.email },
                    session: { access_token: 'token-123' },
                },
                error: null,
            });

            const response = await request(app)
                .post('/api/auth/signup')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User created successfully');
            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('session');
            expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        full_name: userData.fullName,
                        role: userData.role,
                    },
                },
            });
        });

        it('should create a new tutor user', async () => {
            const userData = {
                email: 'tutor@example.com',
                password: 'securePassword123',
                fullName: 'Test Tutor',
                role: 'tutor',
                subjects: ['Math', 'Physics'],
                hourlyRate: 50,
            };

            mockSupabase.auth.signUp.mockResolvedValue({
                data: {
                    user: { id: 'user-456', email: userData.email },
                    session: { access_token: 'token-456' },
                },
                error: null,
            });

            const response = await request(app)
                .post('/api/auth/signup')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('user');
            expect(response.body.user.role).toBe('tutor');
        });

        it('should reject signup with missing required fields', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Validation Error');
            expect(response.body.details).toContain('password is required');
        });

        it('should reject signup with invalid role', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    fullName: 'Test User',
                    role: 'invalid_role',
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Validation Error');
        });

        it('should handle Supabase signup errors', async () => {
            mockSupabase.auth.signUp.mockResolvedValue({
                data: { user: null, session: null },
                error: { message: 'Email already registered' },
            });

            const response = await request(app)
                .post('/api/auth/signup')
                .send({
                    email: 'existing@example.com',
                    password: 'password123',
                    fullName: 'Test User',
                    role: 'student',
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Signup Failed');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            const credentials = {
                email: 'test@example.com',
                password: 'password123',
            };

            mockSupabase.auth.signInWithPassword.mockResolvedValue({
                data: {
                    user: { id: 'user-123', email: credentials.email },
                    session: { access_token: 'token-123', refresh_token: 'refresh-123' },
                },
                error: null,
            });

            getUserWithRoleData.mockResolvedValue({
                user: {
                    id: 'user-123',
                    email: credentials.email,
                    role: 'student',
                },
                error: null,
            });

            const response = await request(app)
                .post('/api/auth/login')
                .send(credentials);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Login successful');
            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('session');
            expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith(credentials);
        });

        it('should reject login with missing fields', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Validation Error');
        });

        it('should reject login with invalid credentials', async () => {
            mockSupabase.auth.signInWithPassword.mockResolvedValue({
                data: { user: null, session: null },
                error: { message: 'Invalid login credentials' },
            });

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword',
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Login Failed');
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should logout authenticated user', async () => {
            verifyToken.mockResolvedValue({
                user: { id: 'user-123' },
                error: null,
            });

            mockSupabase.auth.signOut.mockResolvedValue({ error: null });

            const response = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Logout successful');
        });

        it('should reject logout without authentication', async () => {
            const response = await request(app)
                .post('/api/auth/logout');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/auth/me', () => {
        it('should return current user profile', async () => {
            const mockUser = {
                id: 'user-123',
                email: 'test@example.com',
                role: 'student',
            };

            verifyToken.mockResolvedValue({
                user: mockUser,
                error: null,
            });

            getUserWithRoleData.mockResolvedValue({
                user: mockUser,
                error: null,
            });

            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toMatchObject(mockUser);
        });

        it('should reject unauthenticated request', async () => {
            const response = await request(app)
                .get('/api/auth/me');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/auth/refresh', () => {
        it('should refresh access token', async () => {
            mockSupabase.auth.refreshSession.mockResolvedValue({
                data: {
                    session: {
                        access_token: 'new-token',
                        refresh_token: 'new-refresh',
                    },
                },
                error: null,
            });

            const response = await request(app)
                .post('/api/auth/refresh')
                .send({ refreshToken: 'valid-refresh-token' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Token refreshed successfully');
            expect(response.body).toHaveProperty('session');
        });

        it('should reject refresh without token', async () => {
            const response = await request(app)
                .post('/api/auth/refresh')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Bad Request');
        });

        it('should reject invalid refresh token', async () => {
            mockSupabase.auth.refreshSession.mockResolvedValue({
                data: { session: null },
                error: { message: 'Invalid refresh token' },
            });

            const response = await request(app)
                .post('/api/auth/refresh')
                .send({ refreshToken: 'invalid-token' });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Refresh Failed');
        });
    });

    describe('POST /api/auth/reset-password', () => {
        it('should send password reset email', async () => {
            mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
                error: null,
            });

            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Password reset email sent');
            expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalled();
        });

        it('should reject without email', async () => {
            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({});

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/auth/update-password', () => {
        it('should update password for authenticated user', async () => {
            verifyToken.mockResolvedValue({
                user: { id: 'user-123' },
                error: null,
            });

            mockSupabase.auth.updateUser.mockResolvedValue({
                data: { user: { id: 'user-123' } },
                error: null,
            });

            const response = await request(app)
                .post('/api/auth/update-password')
                .set('Authorization', 'Bearer valid-token')
                .send({ newPassword: 'newSecurePassword123' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Password updated successfully');
        });

        it('should reject unauthenticated password update', async () => {
            const response = await request(app)
                .post('/api/auth/update-password')
                .send({ newPassword: 'newPassword123' });

            expect(response.status).toBe(401);
        });
    });
});
