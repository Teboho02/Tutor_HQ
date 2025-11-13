import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { mockUsers, mockClass } from '../utils/testHelpers.js';

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
const classRoutes = await import('../../routes/classes.js');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/classes', classRoutes.default);

describe('Class Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/classes', () => {
        it('should get all classes', async () => {
            const classes = [mockClass];

            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                order: jest.fn().mockResolvedValue({
                    data: classes,
                    error: null,
                }),
            });

            const response = await request(app)
                .get('/api/classes');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('classes');
            expect(response.body.classes).toHaveLength(1);
        });

        it('should filter classes by tutor', async () => {
            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockResolvedValue({
                    data: [mockClass],
                    error: null,
                }),
            });

            const response = await request(app)
                .get('/api/classes?tutorId=tutor-id-456');

            expect(response.status).toBe(200);
        });
    });

    describe('GET /api/classes/:classId', () => {
        it('should get class details', async () => {
            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: mockClass,
                    error: null,
                }),
            });

            const response = await request(app)
                .get('/api/classes/class-id-123');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('class');
            expect(response.body.class.id).toBe('class-id-123');
        });

        it('should return 404 for non-existent class', async () => {
            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Not found' },
                }),
            });

            const response = await request(app)
                .get('/api/classes/non-existent');

            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/classes', () => {
        it('should create class as tutor', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.tutor,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.tutor,
                error: null,
            });

            const newClass = {
                title: 'New Class',
                subject: 'Math',
                startTime: new Date().toISOString(),
                endTime: new Date(Date.now() + 3600000).toISOString(),
            };

            mockSupabase.from.mockReturnValue({
                insert: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: { id: 'new-class-id', ...newClass },
                    error: null,
                }),
            });

            const response = await request(app)
                .post('/api/classes')
                .set('Authorization', 'Bearer tutor-token')
                .send(newClass);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Class created successfully');
            expect(response.body).toHaveProperty('class');
        });

        it('should reject class creation by non-tutor', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.student,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.student,
                error: null,
            });

            const response = await request(app)
                .post('/api/classes')
                .set('Authorization', 'Bearer student-token')
                .send({
                    title: 'Class',
                    subject: 'Math',
                    startTime: new Date().toISOString(),
                    endTime: new Date().toISOString(),
                });

            expect(response.status).toBe(403);
        });

        it('should validate required fields', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.tutor,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.tutor,
                error: null,
            });

            const response = await request(app)
                .post('/api/classes')
                .set('Authorization', 'Bearer tutor-token')
                .send({ title: 'Incomplete Class' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Validation Error');
        });
    });

    describe('POST /api/classes/:classId/enroll', () => {
        it('should enroll student in class', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.student,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.student,
                error: null,
            });

            // Mock class lookup
            mockSupabase.from.mockReturnValueOnce({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: mockClass,
                    error: null,
                }),
            });

            // Mock existing enrollment check
            mockSupabase.from.mockReturnValueOnce({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: null,
                    error: null,
                }),
            });

            // Mock enrollment insert
            mockSupabase.from.mockReturnValueOnce({
                insert: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: {
                        id: 'enrollment-id',
                        class_id: 'class-id-123',
                        student_id: 'student-id-123',
                    },
                    error: null,
                }),
            });

            const response = await request(app)
                .post('/api/classes/class-id-123/enroll')
                .set('Authorization', 'Bearer student-token');

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Enrolled successfully');
        });

        it('should reject non-student enrollment', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.tutor,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.tutor,
                error: null,
            });

            const response = await request(app)
                .post('/api/classes/class-id-123/enroll')
                .set('Authorization', 'Bearer tutor-token');

            expect(response.status).toBe(403);
        });
    });

    describe('PUT /api/classes/:classId', () => {
        it('should update class by owner', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.tutor,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.tutor,
                error: null,
            });

            // Mock class ownership check
            mockSupabase.from.mockReturnValueOnce({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: { tutor_id: 'tutor-id-456' },
                    error: null,
                }),
            });

            // Mock update
            mockSupabase.from.mockReturnValueOnce({
                update: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: { ...mockClass, status: 'completed' },
                    error: null,
                }),
            });

            const response = await request(app)
                .put('/api/classes/class-id-123')
                .set('Authorization', 'Bearer tutor-token')
                .send({ status: 'completed' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Class updated successfully');
        });

        it('should reject update by non-owner', async () => {
            verifyToken.mockResolvedValue({
                user: { id: 'different-tutor-id' },
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: { ...mockUsers.tutor, id: 'different-tutor-id' },
                error: null,
            });

            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: { tutor_id: 'tutor-id-456' },
                    error: null,
                }),
            });

            const response = await request(app)
                .put('/api/classes/class-id-123')
                .set('Authorization', 'Bearer different-tutor-token')
                .send({ status: 'cancelled' });

            expect(response.status).toBe(403);
        });
    });

    describe('DELETE /api/classes/:classId', () => {
        it('should delete class by owner', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.tutor,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.tutor,
                error: null,
            });

            // Mock ownership check
            mockSupabase.from.mockReturnValueOnce({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: { tutor_id: 'tutor-id-456' },
                    error: null,
                }),
            });

            // Mock delete
            mockSupabase.from.mockReturnValueOnce({
                delete: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({
                    error: null,
                }),
            });

            const response = await request(app)
                .delete('/api/classes/class-id-123')
                .set('Authorization', 'Bearer tutor-token');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Class deleted successfully');
        });
    });
});
