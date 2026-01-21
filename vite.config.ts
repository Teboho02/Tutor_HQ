import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and React Router
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Student pages chunk
          'student-pages': [
            './src/pages/users/students/StudentDashboard.tsx',
            './src/pages/users/students/StudentCalendar.tsx',
            './src/pages/users/students/StudentMaterials.tsx',
            './src/pages/users/students/StudentProgress.tsx',
            './src/pages/users/students/StudentTests.tsx',
            './src/pages/users/students/StudentGoals.tsx',
          ],

          // Tutor pages chunk
          'tutor-pages': [
            './src/pages/users/tutors/TutorDashboard.tsx',
            './src/pages/users/tutors/TutorClasses.tsx',
            './src/pages/users/tutors/TutorSchedule.tsx',
            './src/pages/users/tutors/TutorStudents.tsx',
            './src/pages/users/tutors/TutorMaterials.tsx',
          ],

          // Parent pages chunk
          'parent-pages': [
            './src/pages/users/parents/ParentDashboard.tsx',
            './src/pages/users/parents/ChildProgress.tsx',
            './src/pages/users/parents/ParentSchedule.tsx',
          ],
        },
      },
    },
    // Enable source maps for production debugging
    sourcemap: true,
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Minify code
    minify: 'esbuild',
    // Target modern browsers
    target: 'es2015',
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Server configuration
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: true,
  },
  // Preview configuration
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
    open: true,
  },
})
