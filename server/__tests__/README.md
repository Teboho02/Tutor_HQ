# Test Suite Documentation

This directory contains the comprehensive test suite for the Tutor HQ backend server.

## Test Structure

```
__tests__/
├── setup.js                    # Test setup and configuration
├── mocks/
│   └── supabase.js            # Supabase client mocks
├── utils/
│   └── testHelpers.js         # Test utility functions
├── middleware/
│   └── auth.test.js           # Authentication middleware tests
└── routes/
    ├── auth.test.js           # Authentication route tests
    ├── users.test.js          # User route tests
    ├── classes.test.js        # Class route tests
    └── tests.test.js          # Test/assignment route tests
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (for development)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run tests with verbose output
```bash
npm run test:verbose
```

### Run specific test file
```bash
npm test -- auth.test.js
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="should authenticate"
```

## Test Coverage

The test suite covers:

### Middleware Tests (`middleware/auth.test.js`)
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ Resource ownership verification
- ✅ Optional authentication
- ✅ Request body validation

### Authentication Routes (`routes/auth.test.js`)
- ✅ User signup (student, tutor, parent, admin)
- ✅ User login
- ✅ Logout
- ✅ Get current user profile
- ✅ Token refresh
- ✅ Password reset
- ✅ Password update

### User Routes (`routes/users.test.js`)
- ✅ Get user profile
- ✅ Update user profile
- ✅ Get all tutors (with filters)
- ✅ Get tutor details
- ✅ Update tutor profile
- ✅ Get student details
- ✅ Update student profile
- ✅ Parent-student relationships
- ✅ User search

### Class Routes (`routes/classes.test.js`)
- ✅ Get all classes (with filters)
- ✅ Get class details
- ✅ Create class (tutors only)
- ✅ Update class
- ✅ Delete class
- ✅ Enroll in class (students only)
- ✅ Unenroll from class
- ✅ Update attendance

### Test/Assignment Routes (`routes/tests.test.js`)
- ✅ Get all tests (with filters)
- ✅ Get test details
- ✅ Create test (tutors only)
- ✅ Update test
- ✅ Delete test
- ✅ Assign test to students
- ✅ Get student assignments
- ✅ Submit test answers
- ✅ Grade submissions

## Test Utilities

### Mock Helpers (`utils/testHelpers.js`)

```javascript
import { mockUsers, mockClass, mockTest } from '../utils/testHelpers.js';

// Pre-defined mock users for different roles
const student = mockUsers.student;
const tutor = mockUsers.tutor;
const parent = mockUsers.parent;
const admin = mockUsers.admin;

// Mock data for testing
const testClass = mockClass;
const testQuiz = mockTest;
```

### Supabase Mocks (`mocks/supabase.js`)

The test suite uses mocked Supabase client to avoid hitting the real database:

```javascript
import { createMockSupabase, mockSession } from '../mocks/supabase.js';

const mockSupabase = createMockSupabase();
```

## Writing New Tests

### Basic Test Structure

```javascript
import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

describe('Feature Name', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/endpoint', () => {
        it('should do something', async () => {
            const response = await request(app)
                .get('/api/endpoint')
                .set('Authorization', 'Bearer token');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
        });
    });
});
```

### Testing Authenticated Routes

```javascript
import { verifyToken, getUserProfile } from '../../config/supabase.js';
import { mockUsers } from '../utils/testHelpers.js';

// Setup authentication
verifyToken.mockResolvedValue({
    user: mockUsers.student,
    error: null,
});

getUserProfile.mockResolvedValue({
    profile: mockUsers.student,
    error: null,
});

const response = await request(app)
    .get('/api/protected-route')
    .set('Authorization', 'Bearer valid-token');
```

### Testing Role-Based Access

```javascript
// Test tutor-only endpoint
verifyToken.mockResolvedValue({
    user: mockUsers.tutor,
    error: null,
});

getUserProfile.mockResolvedValue({
    profile: mockUsers.tutor,
    error: null,
});

const response = await request(app)
    .post('/api/tutor-only-endpoint')
    .set('Authorization', 'Bearer tutor-token');

expect(response.status).toBe(200);
```

## Continuous Integration

These tests are designed to run in CI/CD pipelines. Make sure all tests pass before:
- Creating pull requests
- Merging to main branch
- Deploying to production

## Coverage Goals

Minimum coverage targets:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Troubleshooting

### Tests failing due to ES modules

Make sure you're using the correct Node options:
```bash
NODE_OPTIONS=--experimental-vm-modules jest
```

### Mock not working

Clear mocks between tests:
```javascript
beforeEach(() => {
    jest.clearAllMocks();
});
```

### Async test timeouts

Increase timeout in jest.config.js or individual tests:
```javascript
jest.setTimeout(10000); // 10 seconds
```

## Best Practices

1. **Isolate tests**: Each test should be independent
2. **Clear mocks**: Always clear mocks between tests
3. **Use descriptive names**: Test names should clearly describe what they test
4. **Test edge cases**: Don't just test happy paths
5. **Keep tests fast**: Mock external dependencies
6. **Maintain coverage**: Add tests for new features

## Contributing

When adding new features:
1. Write tests first (TDD approach recommended)
2. Ensure all tests pass
3. Meet coverage requirements
4. Update this README if adding new test utilities
