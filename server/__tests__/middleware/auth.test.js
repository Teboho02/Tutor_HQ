import { jest } from '@jest/globals';
import { mockRequest, mockResponse, mockNext, mockUsers } from '../utils/testHelpers.js';

// Mock the Supabase config before importing middleware
jest.unstable_mockModule('../../config/supabase.js', () => ({
    verifyToken: jest.fn(),
    getUserProfile: jest.fn(),
    supabase: {},
    supabaseAdmin: null,
}));

const { verifyToken, getUserProfile } = await import('../../config/supabase.js');
const {
    authenticate,
    requireRole,
    requireOwnership,
    optionalAuth,
    validateBody,
} = await import('../../middleware/auth.js');

describe('Authentication Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('authenticate', () => {
        it('should authenticate valid token', async () => {
            const req = mockRequest({
                headers: { authorization: 'Bearer valid-token' },
            });
            const res = mockResponse();
            const next = mockNext();

            verifyToken.mockResolvedValue({
                user: mockUsers.student,
                error: null,
            });
            getUserProfile.mockResolvedValue({
                profile: mockUsers.student,
                error: null,
            });

            await authenticate(req, res, next);

            expect(verifyToken).toHaveBeenCalledWith('valid-token');
            expect(getUserProfile).toHaveBeenCalledWith(mockUsers.student.id);
            expect(req.user).toEqual(mockUsers.student);
            expect(req.profile).toEqual(mockUsers.student);
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should reject missing authorization header', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const next = mockNext();

            await authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Unauthorized',
                message: 'Missing or invalid authorization header',
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should reject invalid token format', async () => {
            const req = mockRequest({
                headers: { authorization: 'InvalidFormat token' },
            });
            const res = mockResponse();
            const next = mockNext();

            await authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(next).not.toHaveBeenCalled();
        });

        it('should reject expired token', async () => {
            const req = mockRequest({
                headers: { authorization: 'Bearer expired-token' },
            });
            const res = mockResponse();
            const next = mockNext();

            verifyToken.mockResolvedValue({
                user: null,
                error: { message: 'Token expired' },
            });

            await authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Unauthorized',
                message: 'Invalid or expired token',
            });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('requireRole', () => {
        it('should allow access for correct role', () => {
            const req = mockRequest({
                profile: mockUsers.tutor,
            });
            const res = mockResponse();
            const next = mockNext();

            const middleware = requireRole('tutor');
            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should allow access for any of multiple roles', () => {
            const req = mockRequest({
                profile: mockUsers.student,
            });
            const res = mockResponse();
            const next = mockNext();

            const middleware = requireRole(['student', 'tutor']);
            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should deny access for incorrect role', () => {
            const req = mockRequest({
                profile: mockUsers.student,
            });
            const res = mockResponse();
            const next = mockNext();

            const middleware = requireRole('tutor');
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Forbidden',
                message: 'Access denied. Required role(s): tutor',
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should deny access when no profile', () => {
            const req = mockRequest();
            const res = mockResponse();
            const next = mockNext();

            const middleware = requireRole('tutor');
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('requireOwnership', () => {
        it('should allow access to own resource (userId param)', () => {
            const req = mockRequest({
                user: { id: 'user-123' },
                params: { userId: 'user-123' },
            });
            const res = mockResponse();
            const next = mockNext();

            requireOwnership(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should allow access to own resource (id param)', () => {
            const req = mockRequest({
                user: { id: 'user-123' },
                params: { id: 'user-123' },
            });
            const res = mockResponse();
            const next = mockNext();

            requireOwnership(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should allow admin to access any resource', () => {
            const req = mockRequest({
                user: { id: 'admin-id' },
                profile: mockUsers.admin,
                params: { userId: 'user-123' },
            });
            const res = mockResponse();
            const next = mockNext();

            requireOwnership(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should deny access to other users resources', () => {
            const req = mockRequest({
                user: { id: 'user-123' },
                profile: mockUsers.student,
                params: { userId: 'user-456' },
            });
            const res = mockResponse();
            const next = mockNext();

            requireOwnership(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Forbidden',
                message: 'You can only access your own resources',
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should deny unauthenticated access', () => {
            const req = mockRequest({
                params: { userId: 'user-123' },
            });
            const res = mockResponse();
            const next = mockNext();

            requireOwnership(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('optionalAuth', () => {
        it('should attach user if valid token provided', async () => {
            const req = mockRequest({
                headers: { authorization: 'Bearer valid-token' },
            });
            const res = mockResponse();
            const next = mockNext();

            verifyToken.mockResolvedValue({
                user: mockUsers.student,
                error: null,
            });
            getUserProfile.mockResolvedValue({
                profile: mockUsers.student,
                error: null,
            });

            await optionalAuth(req, res, next);

            expect(req.user).toEqual(mockUsers.student);
            expect(req.profile).toEqual(mockUsers.student);
            expect(next).toHaveBeenCalled();
        });

        it('should continue without user if no token provided', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const next = mockNext();

            await optionalAuth(req, res, next);

            expect(req.user).toBeUndefined();
            expect(next).toHaveBeenCalled();
        });

        it('should continue without user if invalid token', async () => {
            const req = mockRequest({
                headers: { authorization: 'Bearer invalid-token' },
            });
            const res = mockResponse();
            const next = mockNext();

            verifyToken.mockResolvedValue({
                user: null,
                error: { message: 'Invalid token' },
            });

            await optionalAuth(req, res, next);

            expect(req.user).toBeUndefined();
            expect(next).toHaveBeenCalled();
        });
    });

    describe('validateBody', () => {
        it('should pass validation for valid data', () => {
            const schema = {
                email: { required: true, type: 'string' },
                age: { required: false, type: 'number' },
            };
            const req = mockRequest({
                body: { email: 'test@example.com', age: 25 },
            });
            const res = mockResponse();
            const next = mockNext();

            const middleware = validateBody(schema);
            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should fail validation for missing required field', () => {
            const schema = {
                email: { required: true, type: 'string' },
            };
            const req = mockRequest({
                body: {},
            });
            const res = mockResponse();
            const next = mockNext();

            const middleware = validateBody(schema);
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Validation Error',
                message: 'Invalid request body',
                details: ['email is required'],
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should fail validation for wrong type', () => {
            const schema = {
                age: { required: true, type: 'number' },
            };
            const req = mockRequest({
                body: { age: '25' }, // string instead of number
            });
            const res = mockResponse();
            const next = mockNext();

            const middleware = validateBody(schema);
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Validation Error',
                message: 'Invalid request body',
                details: ['age must be of type number'],
            });
        });

        it('should handle custom validation functions', () => {
            const schema = {
                email: {
                    required: true,
                    type: 'string',
                    validate: (value) => {
                        if (!value.includes('@')) {
                            return 'email must be a valid email address';
                        }
                    },
                },
            };
            const req = mockRequest({
                body: { email: 'invalid-email' },
            });
            const res = mockResponse();
            const next = mockNext();

            const middleware = validateBody(schema);
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Validation Error',
                message: 'Invalid request body',
                details: ['email must be a valid email address'],
            });
        });

        it('should skip validation for optional missing fields', () => {
            const schema = {
                email: { required: true, type: 'string' },
                phone: { required: false, type: 'string' },
            };
            const req = mockRequest({
                body: { email: 'test@example.com' },
            });
            const res = mockResponse();
            const next = mockNext();

            const middleware = validateBody(schema);
            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});
