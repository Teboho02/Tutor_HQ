import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import './styles/global.css';
import './App.css';

// Import components (not lazy - needed immediately)
import ScrollToTop from './components/ScrollToTop.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { ToastProvider } from './components/Toast.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';

// Lazy load page components for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage.tsx'));
const MainPage = lazy(() => import('./pages/MainPage.tsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.tsx'));
const Analytics = lazy(() => import('./pages/Analytics.tsx'));
const LiveClasses = lazy(() => import('./pages/LiveClasses.tsx'));
const Schedule = lazy(() => import('./pages/Schedule.tsx'));
const TestAssignment = lazy(() => import('./pages/TestAssignment.tsx'));
const StudentTestPage = lazy(() => import('./pages/StudentTestPage.tsx'));
const ParentsDash = lazy(() => import('./pages/ParentsDash.tsx'));
const About = lazy(() => import('./pages/About.tsx'));
const Contact = lazy(() => import('./pages/Contact.tsx'));
const Login = lazy(() => import('./pages/Login.tsx'));
const Signup = lazy(() => import('./pages/Signup.tsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.tsx'));

// Lazy load student portal pages
const StudentDashboard = lazy(() => import('./pages/users/students/StudentDashboard.tsx'));
const StudentCalendar = lazy(() => import('./pages/users/students/StudentCalendar.tsx'));
const StudentMaterials = lazy(() => import('./pages/users/students/StudentMaterials.tsx'));
const StudentProgress = lazy(() => import('./pages/users/students/StudentProgress.tsx'));
const StudentTests = lazy(() => import('./pages/users/students/StudentTests.tsx'));
const TakeTest = lazy(() => import('./pages/users/students/TakeTest.tsx'));
const TestResults = lazy(() => import('./pages/users/students/TestResults.tsx'));
const SubmitAssignment = lazy(() => import('./pages/users/students/SubmitAssignment.tsx'));
const StudentGoals = lazy(() => import('./pages/users/students/StudentGoals.tsx'));
const ScheduleClass = lazy(() => import('./pages/users/students/ScheduleClass.tsx'));

// Lazy load tutor portal pages
const TutorDashboard = lazy(() => import('./pages/users/tutors/TutorDashboard.tsx'));
const TutorClasses = lazy(() => import('./pages/users/tutors/TutorClasses.tsx'));
const TutorSchedule = lazy(() => import('./pages/users/tutors/TutorSchedule.tsx'));
const TutorStudents = lazy(() => import('./pages/users/tutors/TutorStudents.tsx'));
const TutorMaterials = lazy(() => import('./pages/users/tutors/TutorMaterials.tsx'));
const TutorAccount = lazy(() => import('./pages/users/tutors/TutorAccount.tsx'));

// Lazy load parent portal pages
const ParentDashboard = lazy(() => import('./pages/users/parents/ParentDashboard.tsx'));
const ChildProgress = lazy(() => import('./pages/users/parents/ChildProgress.tsx'));
const ParentSchedule = lazy(() => import('./pages/users/parents/ParentSchedule.tsx'));
const ParentAccount = lazy(() => import('./pages/users/parents/ParentAccount.tsx'));

// Notifications page
const Notifications = lazy(() => import('./pages/Notifications.tsx'));

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

                  {/* User-specific dashboards */}
                  <Route path="/parents" element={<ParentsDash />} />

                  {/* Student Portal */}
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/calendar" element={<StudentCalendar />} />
                  <Route path="/student/materials" element={<StudentMaterials />} />
                  <Route path="/student/progress" element={<StudentProgress />} />
                  <Route path="/student/tests" element={<StudentTests />} />
                  <Route path="/student/take-test/:testId" element={<TakeTest />} />
                  <Route path="/student/test-results/:testId" element={<TestResults />} />
                  <Route path="/student/submit-assignment/:assignmentId" element={<SubmitAssignment />} />
                  <Route path="/student/goals" element={<StudentGoals />} />
                  <Route path="/student/schedule-class" element={<ScheduleClass />} />

                  {/* Tutor Portal */}
                  <Route path="/tutor/dashboard" element={<TutorDashboard />} />
                  <Route path="/tutor/classes" element={<TutorClasses />} />
                  <Route path="/tutor/schedule" element={<TutorSchedule />} />
                  <Route path="/tutor/students" element={<TutorStudents />} />
                  <Route path="/tutor/materials" element={<TutorMaterials />} />
                  <Route path="/tutor/account" element={<TutorAccount />} />

                  {/* Parent Portal */}
                  <Route path="/parent/dashboard" element={<ParentDashboard />} />
                  <Route path="/parent/child/:childId" element={<ChildProgress />} />
                  <Route path="/parent/schedule" element={<ParentSchedule />} />
                  <Route path="/parent/account" element={<ParentAccount />} />

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
