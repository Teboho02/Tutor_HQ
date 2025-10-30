# 🎓 TutorHQ - Comprehensive Tutoring Management System

> A modern, full-featured platform connecting students, tutors, and parents for an enhanced online learning experience.

## 📖 Overview

TutorHQ is a comprehensive web-based tutoring management system built with React and TypeScript. It provides separate portals for students, tutors, and parents, offering a complete ecosystem for online education including live classes, test management, progress tracking, and seamless communication.

### Key Features

#### 👨‍🎓 Student Portal
- **Dashboard**: Overview of upcoming classes, recent grades, and assignments
- **Live Classes**: Real-time video conferencing with WebRTC technology
- **Interactive Calendar**: View scheduled classes, tests, and assignments
- **Materials Library**: Access course materials and resources
- **Progress Tracking**: Monitor grades, test scores, and performance analytics
- **Test System**: Take tests with multiple question types (text, multiple choice, multiple select, scale, images)
- **Test Results**: View detailed results with correct answers and score breakdown
- **Messaging**: Direct communication with tutors and parents

#### 👩‍🏫 Tutor Portal
- **Dashboard**: Manage upcoming classes and student overview
- **Class Management**: View and join scheduled classes
- **Smart Scheduler**: Create classes, tests, and assignments with Google Forms-style test builder
- **Test Builder**: Design tests with 5 question types:
  - Text answer questions
  - Multiple choice
  - Multiple select
  - Scale/rating questions
  - Image-based questions
- **Student Management**: Track student progress and performance
- **Materials Upload**: Share resources with students
- **Messaging**: Communicate with students and parents
- **Account Management**: Profile and settings

#### 👪 Parent Portal
- **Multi-Child Dashboard**: Monitor all children's progress in one place
- **Schedule Overview**: View all classes and appointments
- **Payment Tracking**: Manage tuition payments in South African Rand (ZAR)
- **Messaging**: Communicate with tutors
- **Progress Reports**: Access detailed performance reports
- **Account Management**: Family settings and preferences

### Test System Highlights

The test system is a standout feature of TutorHQ:

1. **Tutor-Friendly Test Builder**:
   - Drag-and-drop style expandable question cards
   - Rich question content (text + images)
   - Configurable points per question
   - Auto-calculated total points
   - Real-time question preview

2. **Smart Student Test Taking**:
   - Countdown timer with auto-submit
   - Progress indicator (Question X of Y)
   - Question navigation with overview grid
   - Auto-save draft answers
   - Visual feedback for answered questions
   - Mobile-responsive design

3. **Comprehensive Results Display**:
   - Overall score with percentage and letter grade
   - Pass/fail status
   - Question-by-question review
   - Visual indicators (✓ correct, ✗ wrong)
   - Correct answer display for missed questions
   - Points breakdown per question
   - Downloadable results (PDF)

4. **Status-Based Access Control**:
   - **Upcoming**: Students see test but cannot access until scheduled time
   - **Available**: Full access to take the test
   - **Completed**: Access to results with detailed feedback

## 🛠️ Tech Stack

### Frontend
- **React** 19.1.1 - Modern UI framework
- **TypeScript** 5.9.3 - Type-safe JavaScript
- **React Router DOM** 6.x - Client-side routing
- **CSS Modules** - Component-scoped styling
- **Vite** 7.1.9 - Lightning-fast build tool

### Real-Time Features
- **WebRTC** - Peer-to-peer video conferencing
- **Socket.IO** - WebSocket signaling server (coming soon)

### Design
- Custom CSS with gradient themes
- Responsive design (mobile, tablet, desktop)
- Accessibility-focused UI components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** - [Download](https://git-scm.com/)

### Verify Installation

```bash
node --version  # Should be v18 or higher
npm --version   # Should be v9 or higher
git --version   # Any recent version
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Teboho02/Tutor_HQ.git
cd Tutor_HQ
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React and React DOM
- React Router DOM
- TypeScript and type definitions
- Vite and build tools
- Development dependencies

### 3. Environment Setup (Optional)

Create a `.env` file in the root directory if you need to configure API endpoints or other environment variables:

```env
# API Configuration (update with your backend URL)
VITE_API_URL=http://localhost:3000/api

# WebRTC Configuration
VITE_SIGNALING_SERVER=ws://localhost:3001

# Other Configuration
VITE_APP_NAME=TutorHQ
```

## 🏃 Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at:
```
http://localhost:5174
```

Features in development mode:
- Hot Module Replacement (HMR) - changes reflect instantly
- Source maps for debugging
- TypeScript type checking
- Fast refresh for React components

### Preview Production Build

Build the application and preview it locally:

```bash
npm run build
npm run preview
```

This runs the optimized production build on:
```
http://localhost:4173
```

## 🏗️ Building for Production

### Create Production Build

```bash
npm run build
```

This command:
1. Compiles TypeScript to JavaScript
2. Bundles all assets with Vite
3. Optimizes and minifies code
4. Creates a `dist` folder with production-ready files

### Build Output

```
dist/
├── index.html          # Entry point
├── assets/
│   ├── index-[hash].js    # Bundled JavaScript
│   ├── index-[hash].css   # Bundled CSS
│   └── [images]           # Optimized images
└── ...
```

## 🌐 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Teboho02/Tutor_HQ)

Or manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Environment Variables on Vercel**:
1. Go to Project Settings → Environment Variables
2. Add your variables (VITE_API_URL, etc.)
3. Redeploy the project

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

**Build Settings for Netlify**:
- Build command: `npm run build`
- Publish directory: `dist`

### Deploy to GitHub Pages

1. Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/Tutor_HQ/', // Your repo name
  // ... rest of config
})
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Add scripts to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. Deploy:
```bash
npm run deploy
```

## 📁 Project Structure

```
Tutor_HQ/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── TestBuilder.tsx    # Test creation component
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── users/
│   │   │   ├── students/      # Student portal pages
│   │   │   │   ├── StudentDashboard.tsx
│   │   │   │   ├── StudentTests.tsx
│   │   │   │   ├── TakeTest.tsx      # Test taking interface
│   │   │   │   ├── TestResults.tsx   # Results display
│   │   │   │   └── ...
│   │   │   ├── tutors/        # Tutor portal pages
│   │   │   │   ├── TutorSchedule.tsx # Test builder integration
│   │   │   │   └── ...
│   │   │   └── parents/       # Parent portal pages
│   │   └── ...            # Landing and auth pages
│   ├── types/             # TypeScript type definitions
│   │   ├── test.ts        # Test system types
│   │   └── index.ts       # Global types
│   ├── styles/            # Global styles
│   ├── App.tsx            # Main app component with routing
│   ├── main.tsx           # Application entry point
│   └── vite-env.d.ts      # Vite type declarations
├── .gitignore
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tsconfig.app.json      # App-specific TS config
├── tsconfig.node.json     # Node-specific TS config
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

## 🔧 Configuration Files

### `vite.config.ts`
Vite build configuration including plugins and dev server settings.

### `tsconfig.json`
TypeScript compiler options for strict type checking.

### `eslint.config.js`
Code quality and style rules.

### `package.json`
Project metadata, dependencies, and npm scripts:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🧪 Testing the Application

### Test User Portals

The application has three main portals:

1. **Student Portal**: `/student/dashboard`
2. **Tutor Portal**: `/tutor/dashboard`
3. **Parent Portal**: `/parent/dashboard`

### Test the Test System

1. **Create a Test (Tutor)**:
   - Navigate to `/tutor/schedule`
   - Select "Test" as schedule type
   - Fill in basic information (title, subject, date, time)
   - Click on question cards to expand and configure
   - Add questions of different types
   - Set points for each question
   - Submit to create

2. **Take a Test (Student)**:
   - Navigate to `/student/tests`
   - Click on an "Available" test
   - Answer questions using appropriate input methods
   - Navigate between questions using Next/Previous
   - View progress in the overview grid
   - Submit when complete (or wait for auto-submit)

3. **View Results (Student)**:
   - From `/student/tests`, click on a "Completed" test
   - Review overall score and grade
   - Scroll through question-by-question review
   - See correct answers for missed questions
   - Download results as PDF

### Test Video Calling

1. Open two browser windows (or use different devices)
2. Navigate to `/student/live-classes` in both
3. Click "Join Class" on the same class
4. Allow camera and microphone permissions
5. WebRTC will establish peer-to-peer connection

## 🐛 Troubleshooting

### Port Already in Use

If port 5174 is already in use:

```bash
# Windows
netstat -ano | findstr :5174
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5174 | xargs kill -9
```

Or change the port in `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3000 // Your preferred port
  }
})
```

### TypeScript Errors

Clear TypeScript cache and reinstall:

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Build Errors

Clear Vite cache:

```bash
rm -rf node_modules/.vite
npm run build
```

### WebRTC Not Working

- Check browser permissions for camera/microphone
- Ensure HTTPS is used in production (WebRTC requires secure context)
- Check browser console for specific errors
- Verify signaling server is running (if applicable)

### Missing Dependencies

If you see "Cannot find module" errors:

```bash
npm install
```

If specific package is missing:

```bash
npm install <package-name>
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with descriptive messages**:
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Coding Standards

- Follow TypeScript best practices
- Use functional components with hooks
- Write descriptive variable and function names
- Add comments for complex logic
- Ensure responsive design for all components
- Test on multiple browsers before submitting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact & Support

- **Repository**: [https://github.com/Teboho02/Tutor_HQ](https://github.com/Teboho02/Tutor_HQ)
- **Issues**: [GitHub Issues](https://github.com/Teboho02/Tutor_HQ/issues)
- **Author**: Teboho02

For questions or support, please open an issue on GitHub.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the blazing-fast build tool
- TypeScript team for type safety
- WebRTC community for real-time communication
- All contributors and users of TutorHQ

---

**Made with ❤️ for better education**

🎓 Empowering students, supporting tutors, engaging parents.
