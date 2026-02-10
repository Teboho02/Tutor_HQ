# 🔗 Backend-Frontend Integration Guide

## 📊 Backend Analysis Summary

### **What Has Been Built**

The `Tutor_HQ_API` is a **production-ready Express.js REST API** with the following features:

#### **1. Technology Stack**
- **Framework**: Express.js (ES6 modules)
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth with JWT tokens
- **Security**: Helmet, CORS, rate limiting, cookie-based auth
- **Validation**: express-validator
- **Architecture**: MVC pattern (Controllers, Routes, Middleware)

#### **2. Implemented API Endpoints**

**Authentication** (`/api/auth`)
- ✅ `POST /register` - User registration (student/tutor/parent roles)
- ✅ `POST /login` - Login with cookie-based session
- ✅ `POST /logout` - Logout and clear cookies
- ✅ `GET /me` - Get current authenticated user
- ✅ `POST /refresh` - Refresh access token
- ✅ `POST /forgot-password` - Request password reset
- ✅ `POST /reset-password` - Reset password with token
- ✅ `PATCH /profile` - Update user profile
- ✅ `POST /change-password` - Change password

**Student Portal** (`/api/students`)
- ✅ `GET /dashboard` - Student dashboard overview
- ✅ `GET /profile` - Student profile details
- ✅ `GET /schedule` - Student class schedule
- ✅ `GET /attendance` - Student attendance history

**Tutor Portal** (`/api/tutors`)
- ✅ `GET /dashboard` - Tutor dashboard with analytics
- ✅ `GET /profile` - Tutor profile details
- ✅ `GET /students` - List of tutor's students
- ✅ `GET /schedule` - Tutor's class schedule

**Parent Portal** (`/api/parents`)
- ✅ `POST /link-child` - Link parent to child account
- ✅ `POST /unlink-child` - Unlink child from parent
- ✅ `GET /children` - Get all linked children
- ✅ `GET /children/:childId/performance` - Child performance data
- ✅ `GET /children/:childId/schedule` - Child class schedule
- ✅ `GET /children/:childId/attendance` - Child attendance
- ✅ `GET /dashboard` - Parent dashboard overview

**Classes** (`/api/classes`)
- ✅ `POST /` - Create new class (tutor/admin only)
- ✅ `GET /:id` - Get class details
- ✅ `PUT /:id` - Update class
- ✅ `GET /` - List classes (filtered by role)
- ✅ `DELETE /:id/cancel` - Cancel class

**Tests** (`/api/tests`)
- ✅ `POST /` - Create test (tutor/admin only)
- ✅ `GET /:id` - Get test details
- ✅ `POST /:id/submit` - Submit test answers / Grade test
- ✅ `GET /student/:studentId` - Get student's test results
- ✅ `GET /class/:classId` - Get class test results (tutor only)

#### **3. Database Schema**

**Tables Implemented**:
- ✅ `profiles` - User base table (links to Supabase auth.users)
- ✅ `student_profiles` - Extended student info
- ✅ `tutor_profiles` - Tutor qualifications, bio, rates
- ✅ `parent_profiles` - Parent-child relationships
- ✅ `classes` - Class scheduling and management
- ✅ `class_enrollments` - Student-class relationships with attendance
- ✅ Row-level security (RLS) policies for data protection
- ✅ Automated `updated_at` triggers

#### **4. Security Features**
- ✅ HTTP-only cookies for token storage
- ✅ CORS with whitelist
- ✅ Rate limiting (100 requests/15 min)
- ✅ Helmet.js security headers
- ✅ Input validation on all endpoints
- ✅ Role-based authorization (student/tutor/parent/admin)
- ✅ Password hashing via Supabase Auth

---

## 🔌 Step-by-Step Frontend Integration

### **Phase 1: Setup & Configuration (30 minutes)**

#### **1.1 Install API Client Dependencies**
```bash
cd c:\Users\chant\Documents\GitHub\Tutor_HQ
npm install axios
```

#### **1.2 Create API Configuration**
Create `src/config/api.ts`:
```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: enables cookies
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any custom headers here
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - try refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await apiClient.post('/auth/refresh');
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

#### **1.3 Create Environment Variables**
Create `.env` in frontend root:
```env
VITE_API_URL=http://localhost:5000/api
```

#### **1.4 Start Backend Server**
```bash
cd Tutor_HQ_API
npm install
cp .env.example .env
# Configure .env with your Supabase credentials
npm run dev
```

---

### **Phase 2: Authentication Integration (1 hour)**

#### **2.1 Create Auth Service**
Create `src/services/auth.service.ts`:
```typescript
import apiClient from '../config/api';

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: 'student' | 'tutor' | 'parent';
  parentEmails?: string[];
  childEmails?: string[];
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData) {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData) {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  async logout() {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async updateProfile(data: any) {
    const response = await apiClient.patch('/auth/profile', data);
    return response.data;
  },

  async changePassword(oldPassword: string, newPassword: string) {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword: oldPassword,
      newPassword,
    });
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },
};
```

#### **2.2 Create Auth Context**
Create `src/contexts/AuthContext.tsx`:
```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { useToast } from '../components/Toast';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'tutor' | 'parent' | 'admin';
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchCurrentUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.data.user);
      showToast('Login successful!', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Login failed', 'error');
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authService.register(data);
      setUser(response.data.user);
      showToast('Registration successful!', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Registration failed', 'error');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      showToast('Logged out successfully', 'info');
    } catch (error) {
      showToast('Logout failed', 'error');
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
```

#### **2.3 Update App.tsx**
Wrap app with AuthProvider:
```typescript
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            {/* Your routes */}
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
```

#### **2.4 Update Login Page**
Replace mock login in `src/pages/Login.tsx`:
```typescript
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      
      // Redirect based on role
      const user = await authService.getCurrentUser();
      const role = user.data.user.role;
      
      switch (role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'tutor':
          navigate('/tutor/dashboard');
          break;
        case 'parent':
          navigate('/parent/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

---

### **Phase 3: Create API Services (2 hours)**

#### **3.1 Student Service**
Create `src/services/student.service.ts`:
```typescript
import apiClient from '../config/api';

export const studentService = {
  async getDashboard() {
    const response = await apiClient.get('/students/dashboard');
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get('/students/profile');
    return response.data;
  },

  async getSchedule() {
    const response = await apiClient.get('/students/schedule');
    return response.data;
  },

  async getAttendance() {
    const response = await apiClient.get('/students/attendance');
    return response.data;
  },
};
```

#### **3.2 Tutor Service**
Create `src/services/tutor.service.ts`:
```typescript
import apiClient from '../config/api';

export const tutorService = {
  async getDashboard() {
    const response = await apiClient.get('/tutors/dashboard');
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get('/tutors/profile');
    return response.data;
  },

  async getStudents() {
    const response = await apiClient.get('/tutors/students');
    return response.data;
  },

  async getSchedule() {
    const response = await apiClient.get('/tutors/schedule');
    return response.data;
  },
};
```

#### **3.3 Class Service**
Create `src/services/class.service.ts`:
```typescript
import apiClient from '../config/api';

export const classService = {
  async createClass(data: any) {
    const response = await apiClient.post('/classes', data);
    return response.data;
  },

  async getClass(classId: string) {
    const response = await apiClient.get(`/classes/${classId}`);
    return response.data;
  },

  async updateClass(classId: string, data: any) {
    const response = await apiClient.put(`/classes/${classId}`, data);
    return response.data;
  },

  async listClasses() {
    const response = await apiClient.get('/classes');
    return response.data;
  },

  async cancelClass(classId: string, reason: string) {
    const response = await apiClient.delete(`/classes/${classId}/cancel`, {
      data: { reason },
    });
    return response.data;
  },
};
```

#### **3.4 Test Service**
Create `src/services/test.service.ts`:
```typescript
import apiClient from '../config/api';

export const testService = {
  async createTest(data: any) {
    const response = await apiClient.post('/tests', data);
    return response.data;
  },

  async getTest(testId: string) {
    const response = await apiClient.get(`/tests/${testId}`);
    return response.data;
  },

  async submitTest(testId: string, answers: any) {
    const response = await apiClient.post(`/tests/${testId}/submit`, { answers });
    return response.data;
  },

  async getStudentResults(studentId: string) {
    const response = await apiClient.get(`/tests/student/${studentId}`);
    return response.data;
  },

  async getClassResults(classId: string) {
    const response = await apiClient.get(`/tests/class/${classId}`);
    return response.data;
  },
};
```

#### **3.5 Parent Service**
Create `src/services/parent.service.ts`:
```typescript
import apiClient from '../config/api';

export const parentService = {
  async linkChild(childEmail: string) {
    const response = await apiClient.post('/parents/link-child', { childEmail });
    return response.data;
  },

  async unlinkChild(childId: string) {
    const response = await apiClient.post('/parents/unlink-child', { childId });
    return response.data;
  },

  async getChildren() {
    const response = await apiClient.get('/parents/children');
    return response.data;
  },

  async getChildPerformance(childId: string) {
    const response = await apiClient.get(`/parents/children/${childId}/performance`);
    return response.data;
  },

  async getChildSchedule(childId: string) {
    const response = await apiClient.get(`/parents/children/${childId}/schedule`);
    return response.data;
  },

  async getChildAttendance(childId: string) {
    const response = await apiClient.get(`/parents/children/${childId}/attendance`);
    return response.data;
  },

  async getDashboard() {
    const response = await apiClient.get('/parents/dashboard');
    return response.data;
  },
};
```

---

### **Phase 4: Update Dashboard Pages (3 hours)**

#### **4.1 Update StudentDashboard.tsx**
```typescript
import { useState, useEffect } from 'react';
import { studentService } from '../../../services/student.service';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { SkeletonCard } from '../../../components/SkeletonLoader';
import { useToast } from '../../../components/Toast';

const StudentDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await studentService.getDashboard();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="student-dashboard-page">
        <Header navigationLinks={navigationLinks} />
        <div className="student-dashboard-container">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="student-dashboard-page">
      <Header navigationLinks={navigationLinks} />
      <div className="student-dashboard-container">
        {/* Use dashboardData instead of mock data */}
        <div className="stats-grid">
          {dashboardData.stats.map((stat: any) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Upcoming classes from API */}
        <div className="upcoming-classes">
          {dashboardData.upcomingClasses.map((classItem: any) => (
            <div key={classItem.id} className="class-card">
              {/* ... */}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
```

#### **4.2 Similar updates for:**
- `TutorDashboard.tsx` - Use `tutorService.getDashboard()`
- `ParentsDash.tsx` - Use `parentService.getDashboard()`

---

## 📊 Backend vs Frontend Feature Comparison

### ✅ **Fully Implemented in Backend**

| Feature | Backend API | Frontend UI | Status |
|---------|-------------|-------------|--------|
| **Authentication** | ✅ Complete | ✅ UI Ready | 🔗 Needs Integration |
| **Student Dashboard** | ✅ Complete | ✅ UI Ready | 🔗 Needs Integration |
| **Tutor Dashboard** | ✅ Complete | ✅ UI Ready | 🔗 Needs Integration |
| **Parent Dashboard** | ✅ Complete | ✅ UI Ready | 🔗 Needs Integration |
| **Class Management** | ✅ Complete | ✅ UI Ready | 🔗 Needs Integration |
| **Test Creation** | ✅ Complete | ✅ UI Ready | 🔗 Needs Integration |
| **Test Submission** | ✅ Complete | ✅ UI Ready | 🔗 Needs Integration |
| **Schedule Viewing** | ✅ Complete | ✅ UI Ready | 🔗 Needs Integration |
| **Attendance Tracking** | ✅ Complete | ✅ UI Ready | 🔗 Needs Integration |
| **Parent-Child Linking** | ✅ Complete | ✅ UI Ready | 🔗 Needs Integration |

### ⚠️ **Missing in Backend (Frontend Has UI)**

| Feature | Backend Status | Frontend Status | Action Required |
|---------|----------------|-----------------|-----------------|
| **Goals System** | ❌ Not Implemented | ✅ Complete UI | Build API endpoints |
| **Materials/Resources** | ❌ Not Implemented | ✅ Complete UI | Build API endpoints |
| **Progress Tracking** | ❌ Not Implemented | ✅ Complete UI | Build API endpoints |
| **Live Classes (Video)** | ❌ Not Implemented | ✅ UI exists | Removed from requirements |
| **Payments** | ❌ Not Implemented | ✅ UI exists | Removed from requirements |
| **Admin Portal** | ❌ Not Implemented | ✅ Complete UI | Build API endpoints |
| **Badges/Achievements** | ❌ Not Implemented | ✅ Complete UI | Build API endpoints |
| **Analytics/Reports** | ❌ Not Implemented | ✅ Complete UI | Build API endpoints |
| **Contact/Inquiries** | ⚠️ Partial (route exists) | ✅ Complete UI | Complete implementation |

### 🆕 **Backend Has But Frontend Doesn't Use**

| Feature | Backend | Frontend | Action Required |
|---------|---------|----------|-----------------|
| **Password Reset Flow** | ✅ Complete | ❌ No UI | Build forgot password page |
| **Profile Updates** | ✅ Complete | ⚠️ Mock only | Connect to API |
| **Refresh Token** | ✅ Complete | ❌ Not used | Integrated in axios interceptor |
| **Role-based Authorization** | ✅ Complete | ⚠️ Mock routing | Add route guards |

---

## 🚀 Integration Priority Order

### **Phase 1 - Critical (Week 1)**
1. ✅ Authentication (login/register/logout)
2. ✅ Student Dashboard
3. ✅ Tutor Dashboard
4. ✅ Parent Dashboard
5. ✅ Profile management

### **Phase 2 - High Priority (Week 2)**
6. ✅ Class scheduling and viewing
7. ✅ Test creation and submission
8. ✅ Schedule viewing
9. ✅ Attendance tracking

### **Phase 3 - Medium Priority (Week 3)**
10. ❌ Build Goals API endpoints
11. ❌ Build Materials/Resources API
12. ❌ Build Progress tracking API
13. ❌ Password reset UI pages

### **Phase 4 - Low Priority (Week 4)**
14. ❌ Build Admin portal API
15. ❌ Build Analytics/Reports API
16. ❌ Build Badges/Achievements API

---

## 🔧 Backend Endpoints Still Needed

### **Goals Management**
```typescript
POST   /api/goals                    // Create goal
GET    /api/goals                    // List user goals
GET    /api/goals/:id                // Get goal details
PUT    /api/goals/:id                // Update goal
DELETE /api/goals/:id                // Delete goal
PATCH  /api/goals/:id/progress       // Update progress
```

### **Materials/Resources**
```typescript
POST   /api/materials                // Upload material
GET    /api/materials                // List materials
GET    /api/materials/:id            // Get material details
DELETE /api/materials/:id            // Delete material
GET    /api/classes/:id/materials    // Get class materials
```

### **Progress Tracking**
```typescript
GET    /api/students/:id/progress    // Get student progress
GET    /api/students/:id/grades      // Get grade history
POST   /api/students/:id/grades      // Add grade entry
```

### **Admin Portal**
```typescript
GET    /api/admin/users              // List all users
GET    /api/admin/analytics          // System analytics
GET    /api/admin/reports            // Generate reports
POST   /api/admin/users/:id/approve  // Approve user
POST   /api/admin/users/:id/suspend  // Suspend user
```

### **Badges/Achievements**
```typescript
GET    /api/badges                   // List available badges
GET    /api/students/:id/badges      // Student badges
POST   /api/students/:id/badges      // Award badge
```

---

## 📝 Next Steps Summary

1. **Install axios** in frontend
2. **Create API configuration** with axios interceptors
3. **Create auth context** and integrate with Login/Signup pages
4. **Create service files** for each domain (student, tutor, parent, class, test)
5. **Update dashboard pages** to fetch real data from API
6. **Add loading states** using LoadingSpinner and SkeletonLoader components
7. **Add error handling** using Toast notifications
8. **Build missing backend endpoints** for Goals, Materials, Progress, Admin
9. **Add route guards** to protect authenticated routes
10. **Test end-to-end flows** for each user role

---

## 🎯 Immediate Action Items

**TODAY (2 hours)**:
1. Install axios
2. Create `src/config/api.ts`
3. Create `src/contexts/AuthContext.tsx`
4. Update `App.tsx` to wrap with providers
5. Update `Login.tsx` to use real API

**THIS WEEK**:
1. Create all service files (auth, student, tutor, parent, class, test)
2. Update all dashboard pages to use real data
3. Add loading states everywhere
4. Test authentication flow end-to-end

**NEXT WEEK**:
1. Build missing backend endpoints (Goals, Materials, Progress)
2. Connect remaining frontend features
3. Add comprehensive error handling
4. Deploy to staging environment

The backend is **production-ready** and waiting for frontend integration! 🚀
