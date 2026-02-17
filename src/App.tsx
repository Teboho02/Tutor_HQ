import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import './styles/global.css';
import './App.css';

// Import components (not lazy - needed immediately)
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load page components for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const MainPage = lazy(() => import('./pages/MainPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const LiveClasses = lazy(() => import('./pages/LiveClasses'));
const Schedule = lazy(() => import('./pages/Schedule'));
const TestAssignment = lazy(() => import('./pages/TestAssignment'));
const StudentTestPage = lazy(() => import('./pages/StudentTestPage'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

// Lazy load student portal pages
const StudentDashboard = lazy(() => import('./pages/users/students/StudentDashboard'));
const StudentCalendar = lazy(() => import('./pages/users/students/StudentCalendar'));
const StudentMaterials = lazy(() => import('./pages/users/students/StudentMaterials'));
const StudentProgress = lazy(() => import('./pages/users/students/StudentProgress'));
const StudentTests = lazy(() => import('./pages/users/students/StudentTests'));
const TakeTest = lazy(() => import('./pages/users/students/TakeTest'));
const TestResults = lazy(() => import('./pages/users/students/TestResults'));
const SubmitAssignment = lazy(() => import('./pages/users/students/SubmitAssignment'));
const StudentGoals = lazy(() => import('./pages/users/students/StudentGoals'));
const ScheduleClass = lazy(() => import('./pages/users/students/ScheduleClass'));

// Lazy load tutor portal pages
const TutorDashboard = lazy(() => import('./pages/users/tutors/TutorDashboard'));
const TutorClasses = lazy(() => import('./pages/users/tutors/TutorClasses'));
const TutorSchedule = lazy(() => import('./pages/users/tutors/TutorSchedule'));
const TutorStudents = lazy(() => import('./pages/users/tutors/TutorStudents'));
const TutorMaterials = lazy(() => import('./pages/users/tutors/TutorMaterials'));
const TutorAccount = lazy(() => import('./pages/users/tutors/TutorAccount'));
const TutorOnboarding = lazy(() => import('./pages/users/tutors/TutorOnboarding'));

// Lazy load parent portal pages
const ParentDashboard = lazy(() => import('./pages/users/parents/ParentDashboard'));
const ChildProgress = lazy(() => import('./pages/users/parents/ChildProgress'));
const ParentSchedule = lazy(() => import('./pages/users/parents/ParentSchedule'));
const ParentAccount = lazy(() => import('./pages/users/parents/ParentAccount'));

// Lazy load admin portal pages
const AdminDashboard = lazy(() => import('./pages/users/admin/AdminDashboard'));

// Notifications page
const Notifications = lazy(() => import('./pages/Notifications'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '1.2rem',
    color: 'var(--primary-blue)'
  }}>
    <div>Loading...</div>
  </div>
);


function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <div className="app">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Main landing page */}
                  <Route path="/" element={<LandingPage />} />

                  {/* Main application pages */}
                  <Route path="/main" element={<MainPage />} />

                  {/* Dashboard and user pages */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/analytics" element={<Analytics />} />

                  {/* Learning and classes */}
                  <Route path="/live-classes" element={<LiveClasses />} />
                  <Route path="/schedule" element={<Schedule />} />

                  {/* Tests and assignments */}
                  <Route path="/tests" element={<TestAssignment />} />
                  <Route path="/student-test" element={<StudentTestPage />} />

                  {/* Student Portal — guarded */}
                  <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                  <Route path="/student/calendar" element={<ProtectedRoute allowedRoles={['student']}><StudentCalendar /></ProtectedRoute>} />
                  <Route path="/student/materials" element={<ProtectedRoute allowedRoles={['student']}><StudentMaterials /></ProtectedRoute>} />
                  <Route path="/student/progress" element={<ProtectedRoute allowedRoles={['student']}><StudentProgress /></ProtectedRoute>} />
                  <Route path="/student/tests" element={<ProtectedRoute allowedRoles={['student']}><StudentTests /></ProtectedRoute>} />
                  <Route path="/student/take-test/:testId" element={<ProtectedRoute allowedRoles={['student']}><TakeTest /></ProtectedRoute>} />
                  <Route path="/student/test-results/:testId" element={<ProtectedRoute allowedRoles={['student']}><TestResults /></ProtectedRoute>} />
                  <Route path="/student/submit-assignment/:assignmentId" element={<ProtectedRoute allowedRoles={['student']}><SubmitAssignment /></ProtectedRoute>} />
                  <Route path="/student/goals" element={<ProtectedRoute allowedRoles={['student']}><StudentGoals /></ProtectedRoute>} />
                  <Route path="/student/schedule-class" element={<ProtectedRoute allowedRoles={['student']}><ScheduleClass /></ProtectedRoute>} />

                  {/* Tutor Portal — guarded */}
                  <Route path="/tutor/dashboard" element={<ProtectedRoute allowedRoles={['tutor']}><TutorDashboard /></ProtectedRoute>} />
                  <Route path="/tutor/classes" element={<ProtectedRoute allowedRoles={['tutor']}><TutorClasses /></ProtectedRoute>} />
                  <Route path="/tutor/schedule" element={<ProtectedRoute allowedRoles={['tutor']}><TutorSchedule /></ProtectedRoute>} />
                  <Route path="/tutor/students" element={<ProtectedRoute allowedRoles={['tutor']}><TutorStudents /></ProtectedRoute>} />
                  <Route path="/tutor/materials" element={<ProtectedRoute allowedRoles={['tutor']}><TutorMaterials /></ProtectedRoute>} />
                  <Route path="/tutor/account" element={<ProtectedRoute allowedRoles={['tutor']}><TutorAccount /></ProtectedRoute>} />
                  <Route path="/tutor/onboarding" element={<ProtectedRoute allowedRoles={['tutor']}><TutorOnboarding /></ProtectedRoute>} />

                  {/* Parent Portal — guarded */}
                  <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} />
                  <Route path="/parent/child/:childId" element={<ProtectedRoute allowedRoles={['parent']}><ChildProgress /></ProtectedRoute>} />
                  <Route path="/parent/schedule" element={<ProtectedRoute allowedRoles={['parent']}><ParentSchedule /></ProtectedRoute>} />
                  <Route path="/parent/account" element={<ProtectedRoute allowedRoles={['parent']}><ParentAccount /></ProtectedRoute>} />

                  {/* Admin Portal — guarded */}
                  <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

                  {/* Information pages */}
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Authentication pages */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* Notifications */}
                  <Route path="/notifications" element={<Notifications />} />
                </Routes>
              </Suspense>
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
