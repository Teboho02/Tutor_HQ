import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { mockUsers, mockTest } from '../utils/testHelpers.js';

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
const testRoutes = await import('../../routes/tests.js');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/tests', testRoutes.default);

describe('Test Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/tests', () => {
        it('should get all tests', async () => {
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
                order: jest.fn().mockResolvedValue({
                    data: [mockTest],
                    error: null,
                }),
            });

            const response = await request(app)
                .get('/api/tests')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('tests');
        });

        it('should filter tests by subject', async () => {
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
                order: jest.fn().mockResolvedValue({
                    data: [mockTest],
                    error: null,
                }),
            });

            const response = await request(app)
                .get('/api/tests?subject=Math')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
        });
    });

    describe('POST /api/tests', () => {
        it('should create test as tutor', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.tutor,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.tutor,
                error: null,
            });

            const newTest = {
                title: 'Math Quiz',
                subject: 'Math',
                testType: 'quiz',
                questions: [{ id: 1, question: 'What is 2+2?', points: 5 }],
                totalPoints: 5,
            };

            mockSupabase.from.mockReturnValue({
                insert: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: { id: 'test-id', ...newTest },
                    error: null,
                }),
            });

            const response = await request(app)
                .post('/api/tests')
                .set('Authorization', 'Bearer tutor-token')
                .send(newTest);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Test created successfully');
        });

        it('should reject test creation by non-tutor', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.student,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.student,
                error: null,
            });

            const response = await request(app)
                .post('/api/tests')
                .set('Authorization', 'Bearer student-token')
                .send(mockTest);

            expect(response.status).toBe(403);
        });
    });

    describe('POST /api/tests/:testId/assign', () => {
        it('should assign test to students', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.tutor,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.tutor,
                error: null,
            });

            // Mock test ownership check
            mockSupabase.from.mockReturnValueOnce({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: { tutor_id: 'tutor-id-456' },
                    error: null,
                }),
            });

            // Mock assignment creation
            mockSupabase.from.mockReturnValueOnce({
                insert: jest.fn().mockReturnThis(),
                select: jest.fn().mockResolvedValue({
                    data: [{
                        id: 'assignment-1',
                        test_id: 'test-id-123',
                        student_id: 'student-id-123',
                    }],
                    error: null,
                }),
            });

            const response = await request(app)
                .post('/api/tests/test-id-123/assign')
                .set('Authorization', 'Bearer tutor-token')
                .send({
                    studentIds: ['student-id-123'],
                    dueDate: new Date().toISOString(),
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Test assigned successfully');
        });

        it('should reject assignment by non-owner', async () => {
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
                .post('/api/tests/test-id-123/assign')
                .set('Authorization', 'Bearer different-tutor-token')
                .send({ studentIds: ['student-id-123'] });

            expect(response.status).toBe(403);
        });
    });

    describe('POST /api/tests/assignments/:assignmentId/submit', () => {
        it('should submit test answers', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.student,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.student,
                error: null,
            });

            const answers = [{ questionId: 1, answer: 1 }];

            // Mock assignment check
            mockSupabase.from.mockReturnValueOnce({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: {
                        student_id: 'student-id-123',
                        status: 'assigned',
                    },
                    error: null,
                }),
            });

            // Mock submission creation
            mockSupabase.from.mockReturnValueOnce({
                insert: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: {
                        id: 'submission-id',
                        assignment_id: 'assignment-id-123',
                        answers,
                    },
                    error: null,
                }),
            });

            // Mock status update
            mockSupabase.from.mockReturnValueOnce({
                update: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({ error: null }),
            });

            const response = await request(app)
                .post('/api/tests/assignments/assignment-id-123/submit')
                .set('Authorization', 'Bearer student-token')
                .send({ answers });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Test submitted successfully');
        });

        it('should reject submission of another students assignment', async () => {
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
                    data: {
                        student_id: 'different-student-id',
                        status: 'assigned',
                    },
                    error: null,
                }),
            });

            const response = await request(app)
                .post('/api/tests/assignments/assignment-id-123/submit')
                .set('Authorization', 'Bearer student-token')
                .send({ answers: [] });

            expect(response.status).toBe(403);
        });
    });

    describe('PUT /api/tests/submissions/:submissionId/grade', () => {
        it('should grade submission as tutor', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.tutor,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.tutor,
                error: null,
            });

            // Mock submission fetch with ownership
            mockSupabase.from.mockReturnValueOnce({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: {
                        id: 'submission-id',
                        assignment_id: 'assignment-id',
                        test_assignments: {
                            test_id: 'test-id',
                            tests: { tutor_id: 'tutor-id-456' },
                        },
                    },
                    error: null,
                }),
            });

            // Mock grade update
            mockSupabase.from.mockReturnValueOnce({
                update: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: {
                        id: 'submission-id',
                        score: 85,
                        feedback: 'Good work',
                    },
                    error: null,
                }),
            });

            // Mock assignment status update
            mockSupabase.from.mockReturnValueOnce({
                update: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({ error: null }),
            });

            const response = await request(app)
                .put('/api/tests/submissions/submission-id/grade')
                .set('Authorization', 'Bearer tutor-token')
                .send({ score: 85, feedback: 'Good work' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Test graded successfully');
        });

        it('should reject grading by non-owner tutor', async () => {
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
                    data: {
                        test_assignments: {
                            tests: { tutor_id: 'tutor-id-456' },
                        },
                    },
                    error: null,
                }),
            });

            const response = await request(app)
                .put('/api/tests/submissions/submission-id/grade')
                .set('Authorization', 'Bearer different-tutor-token')
                .send({ score: 85 });

            expect(response.status).toBe(403);
        });
    });

    describe('GET /api/tests/assignments/student/:studentId', () => {
        it('should get student assignments', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.student,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.student,
                error: null,
            });

            const assignments = [
                {
                    id: 'assignment-1',
                    test_id: 'test-id',
                    student_id: 'student-id-123',
                    status: 'assigned',
                    tests: mockTest,
                },
            ];

            mockSupabase.from.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockResolvedValue({
                    data: assignments,
                    error: null,
                }),
            });

            const response = await request(app)
                .get('/api/tests/assignments/student/student-id-123')
                .set('Authorization', 'Bearer student-token');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('assignments');
        });

        it('should reject viewing other students assignments', async () => {
            verifyToken.mockResolvedValue({
                user: mockUsers.student,
                error: null,
            });

            getUserProfile.mockResolvedValue({
                profile: mockUsers.student,
                error: null,
            });

            const response = await request(app)
                .get('/api/tests/assignments/student/different-student-id')
                .set('Authorization', 'Bearer student-token');

            expect(response.status).toBe(403);
        });
    });
});
