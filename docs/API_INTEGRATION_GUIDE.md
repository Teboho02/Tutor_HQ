# API Integration Guide

This guide explains how to integrate the Tutor HQ backend API into your React frontend.

## Table of Contents

1. [Setup](#setup)
2. [Authentication](#authentication)
3. [API Services](#api-services)
4. [Custom Hooks](#custom-hooks)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)

## Setup

### 1. Environment Variables

Create a `.env` file in your project root:

```env
VITE_API_URL=http://localhost:3001
```

### 2. Wrap App with AuthProvider

In your `src/App.tsx`:

```tsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Your routes */}
      </Router>
    </AuthProvider>
  );
}
```

## Authentication

### Using the Auth Context

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  // Check if user is logged in
  if (isAuthenticated) {
    console.log('User:', user);
  }

  // Login
  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: 'password123' });
      // User is now logged in
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Logout
  const handleLogout = async () => {
    await logout();
    // User is now logged out
  };
}
```

### Protecting Routes

Use the `withAuth` HOC to protect routes:

```tsx
import { withAuth } from '../contexts/AuthContext';

const ProtectedPage = withAuth(() => {
  return <div>This page requires authentication</div>;
});

// With role requirement
const TutorOnlyPage = withAuth(() => {
  return <div>Only tutors can see this</div>;
}, 'tutor');

// Multiple roles
const AdminOrTutorPage = withAuth(() => {
  return <div>Admins and tutors can see this</div>;
}, ['admin', 'tutor']);
```

## API Services

All API services are available from `src/api/index.ts`:

### Authentication API

```tsx
import { authApi } from '../api';

// Signup
const user = await authApi.signup({
  email: 'user@example.com',
  password: 'password123',
  fullName: 'John Doe',
  role: 'student',
  gradeLevel: '10th',
  school: 'Example High School',
});

// Login
const response = await authApi.login({
  email: 'user@example.com',
  password: 'password123',
});

// Get current user
const currentUser = await authApi.getCurrentUser();

// Logout
await authApi.logout();

// Reset password
await authApi.resetPassword('user@example.com');
```

### Users API

```tsx
import { usersApi } from '../api';

// Get all tutors
const tutors = await usersApi.getTutors();

// Filter tutors
const mathTutors = await usersApi.getTutors({
  subject: 'Math',
  minRating: 4.0,
  maxRate: 50,
});

// Get tutor details
const tutor = await usersApi.getTutor('tutor-id');

// Update profile
const updatedProfile = await usersApi.updateProfile('user-id', {
  fullName: 'Jane Doe',
  bio: 'Passionate learner',
});

// Search users
const users = await usersApi.searchUsers('john', 'student');
```

### Classes API

```tsx
import { classesApi } from '../api';

// Get all classes
const classes = await classesApi.getClasses();

// Filter classes
const myClasses = await classesApi.getClasses({
  tutorId: 'tutor-id',
  status: 'scheduled',
  subject: 'Math',
});

// Get class details
const classDetails = await classesApi.getClass('class-id');

// Create class (tutors only)
const newClass = await classesApi.createClass({
  title: 'Algebra 101',
  subject: 'Math',
  startTime: '2024-12-01T10:00:00Z',
  endTime: '2024-12-01T11:00:00Z',
  maxStudents: 10,
});

// Enroll in class (students only)
await classesApi.enrollInClass('class-id');

// Unenroll
await classesApi.unenrollFromClass('class-id');
```

### Tests API

```tsx
import { testsApi } from '../api';

// Get all tests
const tests = await testsApi.getTests({ subject: 'Math' });

// Create test (tutors only)
const newTest = await testsApi.createTest({
  title: 'Algebra Quiz',
  subject: 'Math',
  testType: 'quiz',
  questions: [/* questions */],
  totalPoints: 100,
  dueDate: '2024-12-15T23:59:59Z',
});

// Assign test to students
await testsApi.assignTest('test-id', ['student-id-1', 'student-id-2']);

// Get student assignments
const assignments = await testsApi.getStudentAssignments('student-id');

// Submit test
await testsApi.submitTest('assignment-id', [
  { questionId: 1, answer: 'B' },
  { questionId: 2, answer: 'A' },
]);

// Grade submission (tutors only)
await testsApi.gradeSubmission('submission-id', 85, 'Good work!');
```

## Custom Hooks

### useApi Hook

Generic hook for API calls with loading and error states:

```tsx
import { useApi } from '../hooks/useApi';
import { usersApi } from '../api';

function MyComponent() {
  const { data, loading, error, execute } = useApi(usersApi.getTutors);

  useEffect(() => {
    execute(); // Fetch tutors
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(tutor => (
        <div key={tutor.id}>{tutor.name}</div>
      ))}
    </div>
  );
}
```

### useClasses Hook

```tsx
import { useClasses } from '../hooks/useClasses';

function ClassList() {
  const { classes, loading, error, enrollInClass } = useClasses();

  const handleEnroll = async (classId: string) => {
    try {
      await enrollInClass(classId);
      alert('Enrolled successfully!');
    } catch (err) {
      alert('Enrollment failed');
    }
  };

  return (
    <div>
      {classes.map(cls => (
        <div key={cls.id}>
          <h3>{cls.title}</h3>
          <button onClick={() => handleEnroll(cls.id)}>Enroll</button>
        </div>
      ))}
    </div>
  );
}
```

### useStudentAssignments Hook

```tsx
import { useStudentAssignments } from '../hooks/useTests';
import { useAuth } from '../contexts/AuthContext';

function MyAssignments() {
  const { user } = useAuth();
  const { assignments, loading, submitTest } = useStudentAssignments(user?.id);

  const handleSubmit = async (assignmentId: string, answers: any[]) => {
    try {
      await submitTest(assignmentId, answers);
      alert('Test submitted!');
    } catch (err) {
      alert('Submission failed');
    }
  };

  return (
    <div>
      {assignments.map(assignment => (
        <div key={assignment.id}>
          <h3>{assignment.tests.title}</h3>
          <p>Status: {assignment.status}</p>
        </div>
      ))}
    </div>
  );
}
```

## Usage Examples

### Complete Login Example

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ email, password });
      // Redirect based on role
      if (response.user.role === 'student') {
        navigate('/student/dashboard');
      } else if (response.user.role === 'tutor') {
        navigate('/tutor/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Complete Classes List Example

```tsx
import React, { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { classesApi } from '../api';
import { useAuth } from '../contexts/AuthContext';

function ClassesList() {
  const { user } = useAuth();
  const { data: classes, loading, error, execute } = useApi(classesApi.getClasses);

  useEffect(() => {
    execute({ tutorId: user?.id }); // Load tutor's classes
  }, [user]);

  const handleEnroll = async (classId: string) => {
    try {
      await classesApi.enrollInClass(classId);
      await execute({ tutorId: user?.id }); // Refresh list
      alert('Enrolled successfully!');
    } catch (err: any) {
      alert(err.message || 'Enrollment failed');
    }
  };

  if (loading) return <div>Loading classes...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Available Classes</h2>
      {classes?.map(cls => (
        <div key={cls.id} className="class-card">
          <h3>{cls.title}</h3>
          <p>{cls.subject}</p>
          <p>Tutor: {cls.tutors?.profiles?.full_name}</p>
          <p>Time: {new Date(cls.start_time).toLocaleString()}</p>
          {user?.role === 'student' && (
            <button onClick={() => handleEnroll(cls.id)}>
              Enroll
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Best Practices

### 1. Error Handling

Always handle API errors:

```tsx
try {
  const data = await someApi.call();
} catch (error: any) {
  // Show user-friendly error message
  setError(error.message || 'Something went wrong');
  console.error('API Error:', error);
}
```

### 2. Loading States

Show loading indicators:

```tsx
const { data, loading } = useApi(api.getData);

if (loading) return <LoadingSpinner />;
return <DataDisplay data={data} />;
```

### 3. Token Management

Tokens are automatically managed by the API client. They're stored in localStorage and automatically included in requests.

### 4. Refresh User Data

After updating user data, refresh the context:

```tsx
const { refreshUser } = useAuth();

const handleUpdate = async () => {
  await usersApi.updateProfile(userId, newData);
  await refreshUser(); // Update context
};
```

### 5. Type Safety

Import types for better TypeScript support:

```tsx
import type { SignupData, ClassData, TestData } from '../api';

const signupData: SignupData = {
  email: 'user@example.com',
  // ...rest of data
};
```

### 6. Environment Variables

Never hardcode API URLs. Always use environment variables:

```tsx
// ❌ Bad
const API_URL = 'http://localhost:3001';

// ✅ Good
const API_URL = import.meta.env.VITE_API_URL;
```

### 7. Cleanup

Clean up subscriptions and cancel pending requests when components unmount:

```tsx
useEffect(() => {
  let cancelled = false;

  const fetchData = async () => {
    const data = await api.getData();
    if (!cancelled) {
      setData(data);
    }
  };

  fetchData();

  return () => {
    cancelled = true;
  };
}, []);
```

## Troubleshooting

### CORS Errors

If you see CORS errors, ensure your backend is configured to allow requests from your frontend origin.

### 401 Unauthorized

- Check if token is expired
- Verify user is logged in
- Check if API endpoint requires authentication

### Network Errors

- Verify backend server is running
- Check API_URL environment variable
- Verify network connectivity

## Additional Resources

- [Backend API Documentation](../server/README.md)
- [Database Schema](../server/database/README.md)
- [Test Documentation](../server/__tests__/README.md)
