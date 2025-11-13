// Test helper functions

import { jest } from '@jest/globals';

/**
 * Create a mock JWT token for testing
 */
export const createMockToken = (userId = 'test-user-id-123') => {
    return `mock-jwt-token-${userId}`;
};

/**
 * Create authorization header for requests
 */
export const authHeader = (token) => {
    return { Authorization: `Bearer ${token}` };
};

/**
 * Mock user data generators
 */
export const mockUsers = {
    student: {
        id: 'student-id-123',
        email: 'student@example.com',
        full_name: 'Test Student',
        role: 'student',
        created_at: new Date().toISOString(),
    },
    tutor: {
        id: 'tutor-id-456',
        email: 'tutor@example.com',
        full_name: 'Test Tutor',
        role: 'tutor',
        created_at: new Date().toISOString(),
    },
    parent: {
        id: 'parent-id-789',
        email: 'parent@example.com',
        full_name: 'Test Parent',
        role: 'parent',
        created_at: new Date().toISOString(),
    },
    admin: {
        id: 'admin-id-000',
        email: 'admin@example.com',
        full_name: 'Test Admin',
        role: 'admin',
        created_at: new Date().toISOString(),
    },
};

/**
 * Mock class data
 */
export const mockClass = {
    id: 'class-id-123',
    title: 'Test Class',
    subject: 'Math',
    description: 'A test class',
    tutor_id: 'tutor-id-456',
    start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    end_time: new Date(Date.now() + 90000000).toISOString(),
    duration: 60,
    status: 'scheduled',
    max_students: 10,
    is_group: true,
    created_at: new Date().toISOString(),
};

/**
 * Mock test/quiz data
 */
export const mockTest = {
    id: 'test-id-123',
    title: 'Math Quiz 1',
    subject: 'Math',
    test_type: 'quiz',
    tutor_id: 'tutor-id-456',
    questions: [
        {
            id: 1,
            question: 'What is 2+2?',
            type: 'multiple_choice',
            options: ['3', '4', '5', '6'],
            correctAnswer: 1,
            points: 5,
        },
    ],
    total_points: 5,
    duration: 30,
    created_at: new Date().toISOString(),
};

/**
 * Mock Supabase response
 */
export const mockSupabaseResponse = (data = null, error = null) => {
    return Promise.resolve({ data, error });
};

/**
 * Create a mock Express request
 */
export const mockRequest = (overrides = {}) => {
    return {
        body: {},
        params: {},
        query: {},
        headers: {},
        user: null,
        profile: null,
        ...overrides,
    };
};

/**
 * Create a mock Express response
 */
export const mockResponse = () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        sendStatus: jest.fn().mockReturnThis(),
    };
    return res;
};

/**
 * Create a mock Express next function
 */
export const mockNext = () => jest.fn();

/**
 * Wait for async operations
 */
export const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Assert error response format
 */
export const assertErrorResponse = (response, statusCode, errorType) => {
    expect(response.status).toBe(statusCode);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
    if (errorType) {
        expect(response.body.error).toBe(errorType);
    }
};

/**
 * Assert success response format
 */
export const assertSuccessResponse = (response, statusCode = 200) => {
    expect(response.status).toBe(statusCode);
    expect(response.body).toBeDefined();
};
