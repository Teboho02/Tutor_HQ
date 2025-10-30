import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import './App.css';

// Import components
import ScrollToTop from './components/ScrollToTop.tsx';

// Import page components
import LandingPage from './pages/LandingPage.tsx';
import MainPage from './pages/MainPage.tsx';
import TutoringMainPage from './pages/TutoringMainPage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Analytics from './pages/Analytics.tsx';
import LiveClasses from './pages/LiveClasses.tsx';
import Schedule from './pages/Schedule.tsx';
import Payment from './pages/Payment.tsx';
import TestAssignment from './pages/TestAssignment.tsx';
import StudentTestPage from './pages/StudentTestPage.tsx';
import ParentsDash from './pages/ParentsDash.tsx';
import AdminHQ from './pages/AdminHQ.tsx';
import About from './pages/About.tsx';
import Tutors from './pages/Tutors.tsx';
import Contact from './pages/Contact.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';

// Import student portal pages
import StudentDashboard from './pages/users/students/StudentDashboard.tsx';
import StudentLiveClasses from './pages/users/students/StudentLiveClasses.tsx';
import StudentCalendar from './pages/users/students/StudentCalendar.tsx';
import StudentMaterials from './pages/users/students/StudentMaterials.tsx';
import StudentProgress from './pages/users/students/StudentProgress.tsx';
import StudentMessages from './pages/users/students/StudentMessages.tsx';
import StudentTests from './pages/users/students/StudentTests.tsx';
import TakeTest from './pages/users/students/TakeTest.tsx';
import TestResults from './pages/users/students/TestResults.tsx';
import SubmitAssignment from './pages/users/students/SubmitAssignment.tsx';
import VideoCall from './pages/users/students/VideoCall';
import ScheduleClass from './pages/users/students/ScheduleClass.tsx';

// Import tutor portal pages
import TutorDashboard from './pages/users/tutors/TutorDashboard.tsx';
import TutorClasses from './pages/users/tutors/TutorClasses.tsx';
import TutorSchedule from './pages/users/tutors/TutorSchedule.tsx';
import TutorStudents from './pages/users/tutors/TutorStudents.tsx';
import TutorMaterials from './pages/users/tutors/TutorMaterials.tsx';
import TutorMessages from './pages/users/tutors/TutorMessages.tsx';
import TutorAccount from './pages/users/tutors/TutorAccount.tsx';

// Import parent portal pages
import ParentDashboard from './pages/users/parents/ParentDashboard.tsx';
import ChildProgress from './pages/users/parents/ChildProgress.tsx';
import ParentMessages from './pages/users/parents/ParentMessages.tsx';
import ParentPayments from './pages/users/parents/ParentPayments.tsx';
import ParentSchedule from './pages/users/parents/ParentSchedule.tsx';
import ParentAccount from './pages/users/parents/ParentAccount.tsx';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Routes>
          {/* Main landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Main application pages */}
          <Route path="/main" element={<MainPage />} />
          <Route path="/tutoring" element={<TutoringMainPage />} />

          {/* Dashboard and user pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />

          {/* Learning and classes */}
          <Route path="/live-classes" element={<LiveClasses />} />
          <Route path="/schedule" element={<Schedule />} />

          {/* Tests and assignments */}
          <Route path="/tests" element={<TestAssignment />} />
          <Route path="/student-test" element={<StudentTestPage />} />

          {/* Payment and billing */}
          <Route path="/payment" element={<Payment />} />

          {/* User-specific dashboards */}
          <Route path="/parents" element={<ParentsDash />} />
          <Route path="/admin" element={<AdminHQ />} />

          {/* Student Portal */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/live-classes" element={<StudentLiveClasses />} />
          <Route path="/student/calendar" element={<StudentCalendar />} />
          <Route path="/student/materials" element={<StudentMaterials />} />
          <Route path="/student/progress" element={<StudentProgress />} />
          <Route path="/student/tests" element={<StudentTests />} />
          <Route path="/student/take-test/:testId" element={<TakeTest />} />
          <Route path="/student/test-results/:testId" element={<TestResults />} />
          <Route path="/student/submit-assignment/:assignmentId" element={<SubmitAssignment />} />
          <Route path="/student/messages" element={<StudentMessages />} />
          <Route path="/student/video-call/:classId" element={<VideoCall />} />
          <Route path="/student/schedule-class" element={<ScheduleClass />} />

          {/* Tutor Portal */}
          <Route path="/tutor/dashboard" element={<TutorDashboard />} />
          <Route path="/tutor/classes" element={<TutorClasses />} />
          <Route path="/tutor/schedule" element={<TutorSchedule />} />
          <Route path="/tutor/students" element={<TutorStudents />} />
          <Route path="/tutor/materials" element={<TutorMaterials />} />
          <Route path="/tutor/messages" element={<TutorMessages />} />
          <Route path="/tutor/account" element={<TutorAccount />} />

          {/* Parent Portal */}
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
          <Route path="/parent/child/:childId" element={<ChildProgress />} />
          <Route path="/parent/messages" element={<ParentMessages />} />
          <Route path="/parent/payments" element={<ParentPayments />} />
          <Route path="/parent/schedule" element={<ParentSchedule />} />
          <Route path="/parent/account" element={<ParentAccount />} />

          {/* Information pages */}
          <Route path="/about" element={<About />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/contact" element={<Contact />} />

          {/* Authentication pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
