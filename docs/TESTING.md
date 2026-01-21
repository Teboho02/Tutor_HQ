# Testing Guide - TutorHQ

## Overview

TutorHQ uses **Vitest** as the test runner and **React Testing Library** for component testing. This guide explains how to write and run tests.

---

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
# Run all tests
npm test

# Run tests in UI mode
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

---

## 📁 Test Structure

```
src/
├── tests/
│   ├── setup.ts              # Test setup and global mocks
│   ├── Header.test.tsx       # Component test example
│   ├── GoalCard.test.tsx     # Component test example
│   └── videoCompression.test.ts  # Utility test example
├── components/
│   └── *.tsx                 # Add *.test.tsx files alongside components
├── utils/
│   └── *.ts                  # Add *.test.ts files alongside utilities
└── pages/
    └── *.tsx                 # Add *.test.tsx files alongside pages
```

---

## 📝 Writing Tests

### Component Tests

#### Basic Component Test
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <MyComponent />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

#### Testing User Interactions
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../components/Button';

describe('Button Component', () => {
  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

#### Testing Forms
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../components/LoginForm';

describe('LoginForm', () => {
  it('submits form with user input', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    
    render(<LoginForm onSubmit={handleSubmit} />);
    
    // Fill in form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

### Utility Function Tests

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate, calculateGrade } from '../utils/helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2026-01-19');
      expect(formatDate(date)).toBe('19 Jan 2026');
    });
  });
  
  describe('calculateGrade', () => {
    it('calculates percentage correctly', () => {
      expect(calculateGrade(80, 100)).toBe(80);
    });
    
    it('handles edge cases', () => {
      expect(calculateGrade(0, 100)).toBe(0);
      expect(calculateGrade(100, 100)).toBe(100);
    });
  });
});
```

### Hook Tests

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCalendarEvents } from '../hooks/useCalendarEvents';

describe('useCalendarEvents', () => {
  it('fetches calendar events', async () => {
    const { result } = renderHook(() => useCalendarEvents());
    
    await waitFor(() => {
      expect(result.current.events).toHaveLength(5);
    });
  });
});
```

---

## 🎯 Testing Best Practices

### 1. Test Behavior, Not Implementation
❌ **Bad**: Testing internal state
```typescript
expect(component.state.count).toBe(5);
```

✅ **Good**: Testing what the user sees
```typescript
expect(screen.getByText('Count: 5')).toBeInTheDocument();
```

### 2. Use Accessible Queries
**Priority Order**:
1. `getByRole` - Most accessible
2. `getByLabelText` - For form inputs
3. `getByPlaceholderText` - For inputs without labels
4. `getByText` - For non-interactive elements
5. `getByTestId` - Last resort

```typescript
// ✅ Good - Accessible query
const button = screen.getByRole('button', { name: /submit/i });

// ❌ Avoid - Brittle selectors
const button = screen.getByClassName('submit-btn');
```

### 3. Async Testing
```typescript
import { waitFor } from '@testing-library/react';

it('loads data asynchronously', async () => {
  render(<DataComponent />);
  
  // Wait for element to appear
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

### 4. Mock External Dependencies
```typescript
import { vi } from 'vitest';

// Mock API calls
vi.mock('../api/client', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'test' }),
}));

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({ id: '123' }),
}));
```

### 5. Test Edge Cases
```typescript
describe('Input Validation', () => {
  it('handles empty input', () => { /* ... */ });
  it('handles very long input', () => { /* ... */ });
  it('handles special characters', () => { /* ... */ });
  it('handles unicode characters', () => { /* ... */ });
});
```

---

## 📊 Coverage Goals

### Target Coverage
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### Priority Areas
1. **Critical**: Authentication, data validation, security
2. **High**: Core business logic, user workflows
3. **Medium**: UI components, utilities
4. **Low**: Styling, static content

### Check Coverage
```bash
npm run test:coverage
```

View coverage report: `coverage/index.html`

---

## 🏗️ Test Patterns

### Page Component Test
```typescript
describe('StudentDashboard', () => {
  it('displays student information', () => {
    render(<StudentDashboard />);
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });
  
  it('shows upcoming classes', () => {
    render(<StudentDashboard />);
    expect(screen.getByText(/Upcoming Classes/i)).toBeInTheDocument();
  });
});
```

### Modal Component Test
```typescript
describe('AddGoalModal', () => {
  it('opens and closes correctly', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<AddGoalModal isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    
    rerender(<AddGoalModal isOpen={true} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

### Form Validation Test
```typescript
describe('Form Validation', () => {
  it('shows error for invalid email', async () => {
    const user = userEvent.setup();
    render(<SignupForm />);
    
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

---

## 🐛 Debugging Tests

### View Test Output
```bash
npm test -- --reporter=verbose
```

### Debug Single Test
```typescript
import { screen } from '@testing-library/react';

it('debugs component', () => {
  render(<MyComponent />);
  
  // Print DOM to console
  screen.debug();
  
  // Print specific element
  screen.debug(screen.getByRole('button'));
});
```

### Use Vitest UI
```bash
npm run test:ui
```
Opens interactive UI at `http://localhost:51204/__vitest__/`

---

## 🔄 Continuous Integration

### GitHub Actions (To Be Configured)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

---

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 🎓 Testing Checklist

### Before Committing
- [ ] All tests pass locally
- [ ] New features have tests
- [ ] Edge cases are covered
- [ ] No console errors or warnings
- [ ] Coverage meets thresholds

### For New Components
- [ ] Renders without crashing
- [ ] Props are validated
- [ ] User interactions work
- [ ] Accessibility is tested
- [ ] Snapshot test included

### For Bug Fixes
- [ ] Regression test added
- [ ] Test reproduces the bug
- [ ] Test passes after fix

---

## 🚦 Test Status

**Current Coverage**: 0% (Initial Setup)  
**Tests Written**: 3 example tests  
**Target**: 80% coverage by backend completion

**Next Steps**:
1. Write tests for all components
2. Add integration tests for user workflows
3. Set up E2E tests with Playwright
4. Configure CI/CD pipeline

---

**Last Updated**: January 19, 2026
