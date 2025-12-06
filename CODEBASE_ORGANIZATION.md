# TutorHQ Codebase Organization

## 📁 Project Structure

```
Tutor_HQ/
├── public/                          # Public assets
│   └── (no files - cleaned)
│
├── server/                          # Backend server
│   ├── server.js                    # Socket.IO signaling server
│   ├── package.json                 # Server dependencies
│   └── .env                         # Server environment variables
│
├── src/                             # Source code
│   ├── assets/                      # Static assets
│   │   └── logo-hq2.png            # Main logo (optimized)
│   │
│   ├── components/                  # Reusable components
│   │   ├── AddGoalModal.tsx        # Goal creation modal
│   │   ├── FileUpload.tsx          # File upload component
│   │   ├── Footer.tsx              # Page footer
│   │   ├── GoalCard.tsx            # Goal display card
│   │   ├── Header.tsx              # Page header (logo only)
│   │   ├── PayFastPayment.tsx      # Payment integration
│   │   ├── SchoolTestCard.tsx      # Test card component
│   │   ├── ScrollToTop.tsx         # Scroll restoration
│   │   ├── TestBuilder.tsx         # Test creation tool
│   │   └── TutorCruncherCalendar.tsx # Calendar integration
│   │
│   ├── pages/                       # Page components
│   │   ├── admin/                   # Admin portal (8 modules)
│   │   │   ├── AdminDashboard.tsx  # Main admin dashboard
│   │   │   ├── AdminOnboarding.tsx # User onboarding management
│   │   │   ├── AdminPayments.tsx   # Payment processing
│   │   │   ├── AdminScheduling.tsx # Class scheduling
│   │   │   ├── AdminUsers.tsx      # User management
│   │   │   ├── AdminPerformance.tsx # Performance analytics
│   │   │   ├── AdminReports.tsx    # Report generation
│   │   │   ├── AdminSettings.tsx   # System settings
│   │   │   └── AdminActivity.tsx   # Activity logs
│   │   │
│   │   ├── users/                   # User portals
│   │   │   ├── students/            # Student portal (11 pages)
│   │   │   │   ├── StudentDashboard.tsx
│   │   │   │   ├── StudentCalendar.tsx
│   │   │   │   ├── StudentMaterials.tsx
│   │   │   │   ├── StudentProgress.tsx
│   │   │   │   ├── StudentTests.tsx
│   │   │   │   ├── TakeTest.tsx
│   │   │   │   ├── TestResults.tsx
│   │   │   │   ├── SubmitAssignment.tsx
│   │   │   │   ├── StudentGoals.tsx
│   │   │   │   └── ScheduleClass.tsx
│   │   │   │
│   │   │   ├── tutors/              # Tutor portal (6 pages)
│   │   │   │   ├── TutorDashboard.tsx
│   │   │   │   ├── TutorClasses.tsx
│   │   │   │   ├── TutorSchedule.tsx
│   │   │   │   ├── TutorStudents.tsx
│   │   │   │   ├── TutorMaterials.tsx
│   │   │   │   └── TutorAccount.tsx
│   │   │   │
│   │   │   └── parents/             # Parent portal (5 pages)
│   │   │       ├── ParentDashboard.tsx
│   │   │       ├── ChildProgress.tsx
│   │   │       ├── ParentPayments.tsx
│   │   │       ├── ParentSchedule.tsx
│   │   │       └── ParentAccount.tsx
│   │   │
│   │   ├── About.tsx               # About page
│   │   ├── Analytics.tsx           # Analytics page (legacy)
│   │   ├── Contact.tsx             # Contact page
│   │   ├── Dashboard.tsx           # Dashboard page (legacy)
│   │   ├── LandingPage.tsx         # Main landing page
│   │   ├── LiveClasses.tsx         # Live classes page (legacy)
│   │   ├── Login.tsx               # Login page
│   │   ├── MainPage.tsx            # Main dashboard preview page
│   │   ├── ParentsDash.tsx         # Parents dashboard (legacy)
│   │   ├── Payment.tsx             # Payment page (legacy)
│   │   ├── Schedule.tsx            # Schedule page (legacy)
│   │   ├── Signup.tsx              # Signup page
│   │   ├── StudentTestPage.tsx     # Student test page (legacy)
│   │   └── TestAssignment.tsx      # Test assignment page (legacy)
│   │
│   ├── styles/                      # CSS files
│   │   ├── global.css              # Global styles
│   │   ├── AddGoalModal.css
│   │   ├── GoalCard.css
│   │   ├── PayFastPayment.css
│   │   ├── SchoolTestCard.css
│   │   ├── StudentGoals.css
│   │   ├── TutorCruncherCalendar.css
│   │   ├── AdminActivity.css
│   │   ├── AdminDashboard.css
│   │   ├── AdminOnboarding.css
│   │   ├── AdminPayments.css
│   │   ├── AdminPerformance.css
│   │   ├── AdminReports.css
│   │   ├── AdminScheduling.css
│   │   ├── AdminSettings.css
│   │   └── AdminUsers.css
│   │
│   ├── types/                       # TypeScript types
│   │   ├── index.ts                # Main type exports
│   │   ├── admin.ts                # Admin types
│   │   ├── goals.ts                # Goal types
│   │   ├── microassessment.ts      # Assessment types
│   │   ├── monthlyGrade.ts         # Grade types
│   │   ├── payment.ts              # Payment types
│   │   ├── schoolTest.ts           # School test types
│   │   └── test.ts                 # Test types
│   │
│   ├── utils/                       # Utility functions
│   │   └── logger.ts               # Production-safe logger
│   │
│   ├── App.tsx                      # Main app component
│   ├── App.css                      # App styles
│   ├── main.tsx                     # App entry point
│   └── index.css                    # Base styles
│
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── eslint.config.js                 # ESLint configuration
├── index.html                       # HTML entry point
├── package.json                     # Dependencies
├── README.md                        # Project documentation
├── TESTING_GUIDE.md                 # Testing guide
├── tsconfig.app.json                # TypeScript app config
├── tsconfig.json                    # TypeScript config
├── tsconfig.node.json               # TypeScript node config
└── vite.config.ts                   # Vite configuration
```

## 🗂️ File Organization Principles

### 1. **Component Organization**
- **Reusable components**: `/src/components/` - Shared across pages
- **Page components**: `/src/pages/` - Route-specific components
- **Co-located styles**: Each component has its CSS file in the same directory or `/src/styles/`

### 2. **User Portal Structure**
```
pages/users/
├── students/    # All student-facing pages
├── tutors/      # All tutor-facing pages
└── parents/     # All parent-facing pages
```

### 3. **Admin Portal Structure**
```
pages/admin/
├── AdminDashboard.tsx    # Entry point
├── AdminOnboarding.tsx   # User approval
├── AdminPayments.tsx     # Financial management
├── AdminScheduling.tsx   # Class scheduling
├── AdminUsers.tsx        # User management
├── AdminPerformance.tsx  # Analytics
├── AdminReports.tsx      # Reporting
├── AdminSettings.tsx     # System config
└── AdminActivity.tsx     # Activity logs
```

### 4. **Type System**
- **Centralized types**: `/src/types/` - All TypeScript interfaces
- **Domain-specific**: Separated by feature (admin, goals, payments, tests)
- **Main export**: `types/index.ts` - Single import point

### 5. **Styling Architecture**
- **Global styles**: `src/styles/global.css` - Variables, resets, utilities
- **Component styles**: Co-located with components
- **Admin styles**: Centralized in `src/styles/Admin*.css`
- **CSS Variables**: Consistent design tokens

## 🔒 Security & Best Practices

### Environment Variables
```env
# All sensitive data in .env (gitignored)
VITE_TUTORCRUNCHER_API_KEY=xxx
VITE_PAYFAST_MERCHANT_KEY=xxx
```

### Production-Safe Logging
```typescript
// Use logger utility instead of console
import logger from '@/utils/logger';
logger.log('Dev only log'); // Only shows in development
```

### Route Protection
```typescript
// All routes organized by user type
/admin/*      → Admin portal
/student/*    → Student portal
/tutor/*      → Tutor portal
/parent/*     → Parent portal
```

## 🚀 Navigation Structure

### Main Website
- `/` - Landing page
- `/main` - Dashboard preview page
- `/about` - About page
- `/contact` - Contact page
- `/login` - Login page
- `/signup` - Signup page

### User Portals
- **Student**: `/student/dashboard`, `/student/tests`, etc.
- **Tutor**: `/tutor/dashboard`, `/tutor/schedule`, etc.
- **Parent**: `/parent/dashboard`, `/parent/payments`, etc.
- **Admin**: `/admin`, `/admin/users`, etc.

## 📦 Key Features by Portal

### Student Portal (11 Pages)
✅ Dashboard with overview
✅ Interactive calendar
✅ Study materials library
✅ Progress tracking with charts
✅ Test taking system
✅ Test results with detailed feedback
✅ Assignment submission
✅ Personal goals management
✅ Class scheduling

### Tutor Portal (6 Pages)
✅ Dashboard with class overview
✅ Class management
✅ Smart scheduler with test builder
✅ Student progress tracking
✅ Materials upload and sharing
✅ Account management

### Parent Portal (5 Pages)
✅ Multi-child dashboard
✅ Child progress monitoring
✅ Payment tracking (ZAR)
✅ Schedule overview
✅ Account settings

### Admin Portal (8 Modules)
✅ Analytics dashboard
✅ User onboarding approval
✅ Payment processing
✅ Class scheduling with LessonSpace
✅ User management with manual addition
✅ Performance analytics
✅ Report generation
✅ System settings
✅ Activity logs

## 🧹 Recent Cleanup (December 2025)

### Removed
- ❌ `Html code/` folder - Old HTML prototypes (19 files)
- ❌ `Tutors.tsx` - Unused page
- ❌ `TutoringMainPage.tsx` - Placeholder page
- ❌ `AdminHQ.tsx` - Duplicate admin page
- ❌ `StudentMessages.tsx` - Unused messaging
- ❌ `StudentLiveClasses.tsx` - Unused feature
- ❌ `VideoCall.tsx` - Unused video feature
- ❌ `TutorMessages.tsx` - Unused messaging
- ❌ `ParentMessages.tsx` - Unused messaging
- ❌ Duplicate image files (6 files)
- ❌ Outdated documentation (4 files)
- ❌ Unused logo variants

### Optimized
- ✅ Header component - Logo only (removed text)
- ✅ Removed unused imports from App.tsx
- ✅ Cleaned up CSS (removed .logo-text references)
- ✅ Added production-safe logger utility
- ✅ Organized file structure
- ✅ Zero TypeScript errors

## 📊 Codebase Statistics

- **Total Pages**: 40+
- **Admin Modules**: 8
- **Student Pages**: 11
- **Tutor Pages**: 6
- **Parent Pages**: 5
- **Reusable Components**: 10
- **Type Definitions**: 7 files
- **CSS Files**: 35+
- **Routes**: 40+

## 🎯 Code Quality

- ✅ TypeScript strict mode
- ✅ ESLint configured
- ✅ Component-scoped styling
- ✅ Responsive design
- ✅ Accessibility considerations
- ✅ Production-safe logging
- ✅ Environment variable security
- ✅ Clean file organization
- ✅ Zero compilation errors

## 🔧 Maintenance

### Adding New Pages
1. Create component in appropriate folder (`pages/users/students/`, etc.)
2. Create corresponding CSS file
3. Add route to `App.tsx`
4. Export types if needed in `types/`

### Adding New Features
1. Create components in `components/`
2. Add types to `types/`
3. Use logger utility for debugging
4. Follow existing naming conventions

### Styling Guidelines
- Use CSS variables from `global.css`
- Keep styles co-located with components
- Mobile-first responsive design
- Consistent spacing and colors

---

**Last Updated**: December 6, 2025
**Version**: 1.0.0
**Status**: Production Ready ✨
