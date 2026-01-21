# UI Components Usage Guide

This guide provides examples for using the production-ready UI components.

## 📦 Components Overview

### 1. Loading Components
- **LoadingSpinner**: Global loading indicator
- **SkeletonLoader**: Content placeholder with shimmer effect

### 2. Error Handling
- **ErrorBoundary**: React error boundary with retry functionality
- **Toast**: Notification system with multiple types
- **Error Pages**: 404, 500, 401, 403, Network Error, Maintenance

### 3. Form Components
- **FormInput**: Text input with validation
- **FormTextarea**: Textarea with validation and character count

### 4. Empty States
- **EmptyState**: Reusable empty state component

---

## 🔄 LoadingSpinner

### Basic Usage
```tsx
import LoadingSpinner from './components/LoadingSpinner';

// Small inline spinner
<LoadingSpinner size="small" />

// Medium spinner with message
<LoadingSpinner size="medium" message="Loading data..." />

// Fullscreen overlay
<LoadingSpinner fullScreen message="Please wait..." />
```

### Props
- `size`: `'small' | 'medium' | 'large'` (default: `'medium'`)
- `color`: Custom color (default: `'#667eea'`)
- `fullScreen`: Boolean for fullscreen overlay (default: `false`)
- `message`: Optional loading message

### Example in Component
```tsx
function Dashboard() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  return <div>Dashboard Content</div>;
}
```

---

## 💀 SkeletonLoader

### Preset Components
```tsx
import { SkeletonText, SkeletonCard, SkeletonProfile, SkeletonTable } from './components/SkeletonLoader';

// Text skeleton (3 lines)
<SkeletonText lines={3} />

// Card skeleton
<SkeletonCard />

// Profile skeleton
<SkeletonProfile />

// Table skeleton (5 rows, 4 columns)
<SkeletonTable rows={5} columns={4} />
```

### Custom Skeleton
```tsx
import SkeletonLoader from './components/SkeletonLoader';

// Circle avatar
<SkeletonLoader variant="circle" width="50px" height="50px" />

// Custom rectangle
<SkeletonLoader variant="rectangle" width="200px" height="100px" />

// Multiple items
<SkeletonLoader variant="text" count={5} />
```

### Example in Component
```tsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div>
        <SkeletonProfile />
        <SkeletonProfile />
        <SkeletonProfile />
      </div>
    );
  }

  return <div>{/* Render users */}</div>;
}
```

---

## 🛡️ ErrorBoundary

### Wrap Your App
```tsx
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

### With Custom Fallback
```tsx
<ErrorBoundary 
  fallback={<div>Custom error message</div>}
  onError={(error, errorInfo) => {
    // Log to error tracking service
    console.error('Error caught:', error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### Wrap Specific Components
```tsx
function Dashboard() {
  return (
    <div>
      <Header />
      <ErrorBoundary>
        <CriticalWidget />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
```

---

## 🔔 Toast Notifications

### Setup Provider
```tsx
import { ToastProvider } from './components/Toast';

// Wrap your app
function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}
```

### Use Toast Hook
```tsx
import { useToast } from './components/Toast';

function MyComponent() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast('Operation completed successfully!', 'success');
  };

  const handleError = () => {
    showToast('An error occurred', 'error', 8000); // 8 seconds
  };

  const handleWarning = () => {
    showToast('Please save your changes', 'warning');
  };

  const handleInfo = () => {
    showToast('New features available', 'info');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

### Toast Types
- `success`: Green with checkmark
- `error`: Red with X
- `warning`: Orange with warning icon
- `info`: Blue with info icon

---

## 📝 Form Validation

### Setup with Zod Schemas
```tsx
import FormInput from './components/FormInput';
import FormTextarea from './components/FormTextarea';
import { emailSchema, passwordSchema } from './utils/validation';
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <form>
      <FormInput
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={setEmail}
        schema={emailSchema}
        required
        validateOnBlur
        helpText="Enter your email address"
      />

      <FormInput
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={setPassword}
        schema={passwordSchema}
        required
        validateOnBlur
      />

      <button type="submit">Login</button>
    </form>
  );
}
```

### FormTextarea with Character Count
```tsx
<FormTextarea
  label="Message"
  name="message"
  value={message}
  onChange={setMessage}
  maxLength={500}
  showCharCount
  rows={6}
  helpText="Tell us about your issue"
  required
/>
```

### Available Validation Schemas
- `emailSchema`: Email validation
- `passwordSchema`: Strong password (8+ chars, uppercase, lowercase, number)
- `phoneSchema`: Phone number format
- `nameSchema`: Name validation (2-50 chars)
- `usernameSchema`: Username (3-20 chars, alphanumeric + underscore)
- `loginSchema`: Email + password
- `signupSchema`: Username + email + password + confirm password
- `contactSchema`: Name + email + subject + message
- `profileSchema`: First name + last name + email + phone
- `goalSchema`: Title + description + target date + category

---

## 🚫 Error Pages

### 404 - Not Found
```tsx
import NotFound404 from './pages/errors/NotFound404';

// In your router
<Route path="*" element={<NotFound404 />} />
```

### 500 - Server Error
```tsx
import ServerError500 from './pages/errors/ServerError500';

// Navigate programmatically
navigate('/errors/500');
```

### 401 - Unauthorized
```tsx
import Unauthorized401 from './pages/errors/Unauthorized401';

// Use in protected route wrapper
if (!isAuthenticated) {
  return <Unauthorized401 />;
}
```

### 403 - Forbidden
```tsx
import Forbidden403 from './pages/errors/Forbidden403';

// Use in role-based access
if (!hasPermission) {
  return <Forbidden403 />;
}
```

### Network Error
```tsx
import NetworkError from './pages/errors/NetworkError';

// Show on network failure
catch (error) {
  if (error.message === 'Network Error') {
    navigate('/errors/network');
  }
}
```

### Maintenance Mode
```tsx
import Maintenance from './pages/errors/Maintenance';

// Show during maintenance
if (isMaintenanceMode) {
  return <Maintenance />;
}
```

---

## 📭 Empty States

### Basic Usage
```tsx
import EmptyState from './components/EmptyState';

// No data
<EmptyState
  variant="no-data"
  title="No data available"
  description="There's nothing here yet. Start by adding some data."
  actionLabel="Add Data"
  onAction={() => navigate('/add')}
/>

// No search results
<EmptyState
  variant="no-results"
  title="No results found"
  description="Try adjusting your search filters"
  actionLabel="Clear Filters"
  onAction={clearFilters}
/>

// No items
<EmptyState
  variant="no-items"
  title="No items in your cart"
  description="Browse our catalog to find items"
  actionLabel="Browse Catalog"
  onAction={() => navigate('/catalog')}
/>

// Error state
<EmptyState
  variant="error"
  title="Failed to load data"
  description="An error occurred while loading. Please try again."
  actionLabel="Retry"
  onAction={retryLoad}
/>
```

### Custom Icon
```tsx
<EmptyState
  icon="🎉"
  title="All caught up!"
  description="You've completed all your tasks"
/>
```

### Example in Component
```tsx
function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <SkeletonText lines={5} />;
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        variant="no-items"
        title="No tasks yet"
        description="Create your first task to get started"
        actionLabel="Create Task"
        onAction={() => setShowModal(true)}
      />
    );
  }

  return <div>{/* Render tasks */}</div>;
}
```

---

## 🎨 Complete Example: Form with All Features

```tsx
import { useState } from 'react';
import { useToast } from './components/Toast';
import FormInput from './components/FormInput';
import FormTextarea from './components/FormTextarea';
import LoadingSpinner from './components/LoadingSpinner';
import { contactSchema } from './utils/validation';

function ContactForm() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate entire form
      contactSchema.parse(formData);
      
      setLoading(true);
      
      // Submit form
      await submitForm(formData);
      
      showToast('Message sent successfully!', 'success');
      
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      showToast('Please fix the errors in the form', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Name"
        name="name"
        value={formData.name}
        onChange={(value) => setFormData({ ...formData, name: value })}
        required
        validateOnBlur
      />

      <FormInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={(value) => setFormData({ ...formData, email: value })}
        required
        validateOnBlur
      />

      <FormInput
        label="Subject"
        name="subject"
        value={formData.subject}
        onChange={(value) => setFormData({ ...formData, subject: value })}
        required
        validateOnBlur
      />

      <FormTextarea
        label="Message"
        name="message"
        value={formData.message}
        onChange={(value) => setFormData({ ...formData, message: value })}
        maxLength={1000}
        showCharCount
        required
        validateOnBlur
      />

      <button type="submit" disabled={loading}>
        {loading ? <LoadingSpinner size="small" /> : 'Send Message'}
      </button>
    </form>
  );
}
```

---

## 🎯 Best Practices

1. **Loading States**: Always show loading feedback for async operations
2. **Error Boundaries**: Wrap critical components to prevent app crashes
3. **Form Validation**: Validate on blur for better UX, validate on submit for security
4. **Toast Notifications**: Use appropriate types (success, error, warning, info)
5. **Empty States**: Always provide action buttons when possible
6. **Accessibility**: All components support reduced motion and dark mode
7. **Mobile**: All components are fully responsive

---

## 📱 Accessibility Features

All components include:
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Reduced motion support
- ✅ Dark mode support
- ✅ High contrast mode support

---

## 🎨 Styling

All components use separate CSS files and can be customized by:
1. Overriding CSS classes
2. Using CSS variables from `global.css`
3. Passing custom className props

Example:
```css
/* Custom styling */
.my-custom-spinner {
  --spinner-color: #ff0000;
}
```

```tsx
<LoadingSpinner className="my-custom-spinner" />
```
