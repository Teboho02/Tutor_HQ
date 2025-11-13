import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { mockUsers } from '../utils/testHelpers.js';

// Mock Supabase
const mockSupabase = {
    from: jest.fn(),
};

jest.unstable_mockModule('../../config/supabase.js', () => ({
    supabase: mockSupabase,
    verifyToken: jest.fn(),
    getUserProfile: jest.fn(),
}));

const { verifyToken, getUserProfile } = await import('../../config/supabase.js');
const userRoutes = await import('../../routes/users.js');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes.default);

describe('User Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/users/profile/:userId', () => {
        it('should get user profile', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.student,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.student,
                error: null,
            });

            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: mockUsers.student,
                    error: null,
                }),
            });

            const response = await request(app)
                .get('/api/users/profile/student-id-123')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('profile');
            expect(response.body.profile).toMatchObject(mockUsers.student);
        });

        it('should return 404 for non-existent user', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.student,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.student,
                error: null,
            });

            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Not found' },
                }),
            });

            const response = await request(app)
                .get('/api/users/profile/non-existent')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/users/profile/:userId', () => {
        it('should update own profile', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.student,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.student,
                error: null,
            });

            const updatedProfile = {
                ...mockUsers.student,
                full_name: 'Updated Name',
                bio: 'Updated bio',
            };

            mockSupabase.from.mockReturnValue({
                update: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: updatedProfile,
                    error: null,
                }),
            });

            const response = await request(app)
                .put('/api/users/profile/student-id-123')
                .set('Authorization', 'Bearer valid-token')
                .send({
                    fullName: 'Updated Name',
                    bio: 'Updated bio',
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Profile updated successfully');
            expect(response.body.profile).toMatchObject(updatedProfile);
        });

        it('should reject updating another users profile', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.student,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.student,
                error: null,
            });

            const response = await request(app)
                .put('/api/users/profile/different-user-id')
                .set('Authorization', 'Bearer valid-token')
                .send({ fullName: 'Hacked Name' });

            expect(response.status).toBe(403);
        });
    });

    describe('GET /api/users/tutors', () => {
        it('should get list of tutors', async () => {
            const tutors = [
                {
                    id: 'tutor-1',
                    subjects: ['Math', 'Physics'],
                    hourly_rate: 50,
                    rating: 4.5,
                    profiles: {
                        full_name: 'Tutor One',
                        email: 'tutor1@example.com',
                    },
                },
                {
                    id: 'tutor-2',
                    subjects: ['English', 'History'],
                    hourly_rate: 45,
                    rating: 4.8,
                    profiles: {
                        full_name: 'Tutor Two',
                        email: 'tutor2@example.com',
                    },
                },
            ];

            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    data: tutors,
                    error: null,
                }),
            });

            const response = await request(app)
                .get('/api/users/tutors');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('tutors');
            expect(response.body.tutors).toHaveLength(2);
        });

        it('should filter tutors by subject', async () => {
            const mathTutors = [
                {
                    id: 'tutor-1',
                    subjects: ['Math', 'Physics'],
                    profiles: { full_name: 'Math Tutor' },
                },
            ];

            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                contains: jest.fn().mockResolvedValue({
                    data: mathTutors,
                    error: null,
                }),
            });

            const response = await request(app)
                .get('/api/users/tutors?subject=Math');

            expect(response.status).toBe(200);
            expect(response.body.tutors).toHaveLength(1);
        });
    });

    describe('GET /api/users/tutors/:tutorId', () => {
        it('should get tutor details', async () => {
            const tutor = {
                id: 'tutor-id-456',
                subjects: ['Math'],
                hourly_rate: 50,
                profiles: {
                    full_name: 'Test Tutor',
                    email: 'tutor@example.com',
                },
            };

            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: tutor,
                    error: null,
                }),
            });

            const response = await request(app)
                .get('/api/users/tutors/tutor-id-456');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('tutor');
            expect(response.body.tutor.id).toBe('tutor-id-456');
        });
    });

    describe('PUT /api/users/tutors/:tutorId', () => {
        it('should update tutor profile', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.tutor,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.tutor,
                error: null,
            });

            const updatedTutor = {
                ...mockUsers.tutor,
                hourly_rate: 60,
            };

            mockSupabase.from.mockReturnValue({
                update: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: updatedTutor,
                    error: null,
                }),
            });

            const response = await request(app)
                .put('/api/users/tutors/tutor-id-456')
                .set('Authorization', 'Bearer valid-token')
                .send({ hourlyRate: 60 });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Tutor profile updated successfully');
        });
    });

    describe('GET /api/users/search', () => {
        it('should search users by name', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.student,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.student,
                error: null,
            });

            const searchResults = [
                { id: '1', full_name: 'John Doe', email: 'john@example.com' },
                { id: '2', full_name: 'Jane Doe', email: 'jane@example.com' },
            ];

            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                or: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue({
                    data: searchResults,
                    error: null,
                }),
            });

            const response = await request(app)
                .get('/api/users/search?query=doe')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('users');
            expect(response.body.users).toHaveLength(2);
        });

        it('should require search query', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.student,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.student,
                error: null,
            });

            const response = await request(app)
                .get('/api/users/search')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Bad Request');
        });

        it('should filter search by role', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.student,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.student,
                error: null,
            });

            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                or: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue({
                    data: [mockUsers.student],
                    error: null,
                }),
            });

            const response = await request(app)
                .get('/api/users/search?query=test&role=student')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
        });
    });
});
