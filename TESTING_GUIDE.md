# Admin System Testing Guide

## 🚀 Quick Start

To test all the admin modules in your browser:

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the Admin Dashboard**:
   ```
   http://localhost:5174/admin
   ```

---

## 📍 Admin Module Routes

### Main Dashboard
- **URL**: `/admin`
- **Description**: CEO overview with analytics, notifications, and navigation to all modules

### Module Routes
1. **Onboarding**: `/admin/onboarding`
   - Test: Approve/reject student and tutor applications
   - Test: View documents, add notes

2. **Payments**: `/admin/payments`
   - Test: Switch between student payments and tutor payouts tabs
   - Test: Mark payments as paid, send reminders
   - Test: Process tutor payouts

3. **Scheduling**: `/admin/scheduling`
   - Test: Toggle between calendar and list view
   - Test: Copy LessonSpace links
   - Test: Generate new LessonSpace URL for sessions without one
   - Test: Create new session modal

4. **Users**: `/admin/users`
   - Test: Switch between Students, Tutors, Parents tabs
   - Test: Search users by name/email
   - Test: Filter by status (all/active/inactive/suspended)
   - Test: Edit user information (click Edit button)
   - Test: Suspend active users, reactivate suspended users

5. **Performance**: `/admin/performance`
   - Test: Toggle between Individual and Class performance
   - Test: View student performance cards with subject breakdowns
   - Test: Check trend indicators (improving/declining/stable)
   - Test: View flagged students warnings

6. **Reports**: `/admin/reports`
   - Test: Toggle between Financial and Academic reports
   - Test: View revenue/expense breakdowns
   - Test: View subject performance tables with progress bars
   - Test: Export buttons (currently show alert)

7. **Settings**: `/admin/settings`
   - Test: Update platform settings (name, email, currency, timezone)
   - Test: Configure business settings (platform fee, session duration)
   - Test: Add integration credentials (PayFast, TutorCruncher, LessonSpace)
   - Test: Toggle notification settings
   - Test: Save all settings

8. **Activity**: `/admin/activity`
   - Test: Search activities by action/description/user
   - Test: Filter by category (user/payment/session/system)
   - Test: View activity timeline with timestamps
   - Test: Export log button

---

## 🔍 Testing Checklist

### Visual Testing
- [ ] All pages load without errors
- [ ] All navigation links work
- [ ] All buttons are clickable
- [ ] All modals open and close properly
- [ ] All tabs switch correctly
- [ ] All toggles work (view modes, report types)

### Functional Testing
- [ ] Search functionality filters results
- [ ] Filter dropdowns work
- [ ] Edit modals populate with correct data
- [ ] Save buttons show confirmation
- [ ] Copy buttons work (check console or clipboard)
- [ ] Stats and metrics display correctly

### Responsive Testing
- [ ] Desktop view (1920px): All features visible
- [ ] Tablet view (768px): Layout adjusts properly
- [ ] Mobile view (375px): Mobile-optimized layout

### Data Testing
- [ ] Mock data displays correctly
- [ ] All tables show data
- [ ] All cards show stats
- [ ] All lists populate
- [ ] Empty states show when filtered to nothing

---

## 🐛 Common Issues & Fixes

### Issue: Page not loading
**Fix**: Check that the route is added in `App.tsx` and component is imported

### Issue: TypeScript errors
**Fix**: Run `npm run build` to check for compilation errors

### Issue: Missing styles
**Fix**: Verify CSS file is imported at top of component

### Issue: Data not showing
**Fix**: Check mock data in component useState initialization

---

## 📱 Responsive Breakpoints

```css
/* Desktop: 1024px and above (default) */
/* Tablet: 768px - 1024px */
@media (max-width: 1024px) { ... }

/* Mobile: below 768px */
@media (max-width: 768px) { ... }
```

---

## 🎨 Theme Colors

```css
--primary-color: #667eea (Blue/Purple)
--primary-hover: #5568d3
--text-primary: #1a202c (Dark)
--text-secondary: #4a5568 (Gray)

Module Colors:
- Onboarding: #667eea (Blue/Purple)
- Users: #764ba2 (Purple)
- Scheduling: #f59e0b (Orange)
- Payments: #10b981 (Green)
- Performance: #3b82f6 (Blue)
- Reports: #8b5cf6 (Purple)
- Settings: #6b7280 (Gray)
- Activity: #ec4899 (Pink)
```

---

## 🔗 Quick Navigation Flow

```
Landing Page (/)
    ↓
Admin Dashboard (/admin)
    ↓
┌───────────────────────────────────────┐
│  8 Admin Modules (clickable cards)   │
├───────────────────────────────────────┤
│  • Onboarding    • Users             │
│  • Scheduling    • Payments          │
│  • Performance   • Reports           │
│  • Settings      • Activity          │
└───────────────────────────────────────┘
    ↓
Each module has "← Back to Dashboard" button
```

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit

# Lint code
npm run lint
```

---

## ✅ Testing Steps (Recommended Order)

1. **Start with Dashboard** (`/admin`)
   - Verify all 8 module cards display
   - Check analytics metrics show
   - Test quick action buttons

2. **Test Navigation**
   - Click each module card from dashboard
   - Verify each page loads
   - Click "Back to Dashboard" on each

3. **Test Priority 1 Modules** (Critical)
   - AdminScheduling: LessonSpace integration
   - AdminUsers: Suspend/reactivate functionality

4. **Test Priority 2 Modules** (Core)
   - AdminPerformance: Analytics displays
   - AdminReports: Financial and academic reports

5. **Test Priority 3 Modules** (Supporting)
   - AdminSettings: All configuration sections
   - AdminActivity: Activity log and filters

6. **Test Previously Built Modules**
   - AdminOnboarding: Application approval
   - AdminPayments: Payment processing

7. **Test Responsive Design**
   - Resize browser to mobile width
   - Check all pages adapt properly
   - Test on actual mobile device if possible

---

## 📊 Expected Mock Data

### Students: 3 mock students
- Thabo Mabaso (Grade 11)
- Lindiwe Nkosi (Grade 9)
- Sipho Khumalo (Grade 12 - Flagged)

### Tutors: 3 mock tutors
- Sipho Dlamini (Mathematics, Sciences)
- Nomsa Shabalala (English, History)
- Thandi Zulu (Accounting, Business)

### Parents: 2 mock parents
- John Nkosi
- Sarah Mabaso

### Classes: 4 mock sessions
- Mathematics - Algebra
- Physical Sciences - Chemistry
- English Literature
- Life Sciences - Biology

### Payments: Multiple transactions
- Student payments with various statuses
- Tutor payouts pending/processed

---

## 🎯 Key Features to Test

### LessonSpace Integration (AdminScheduling)
- Generate URL button appears for sessions without link
- Copy link button works
- Send links button shows alert
- Create session modal has "Auto-generate LessonSpace URL" checkbox

### User Suspension (AdminUsers)
- Active users show "Suspend" button
- Suspended users show "Reactivate" button
- Inactive users show "Reactivate" button
- Status badges update correctly

### Performance Trends (AdminPerformance)
- Green/up arrow for "improving"
- Red/down arrow for "declining"
- Gray/right arrow for "stable"
- Flagged students show warning banner

### Report Generation (AdminReports)
- Financial report shows revenue/expenses breakdown
- Net profit calculation correct
- Academic report shows subject averages
- Progress bars width matches percentages

---

## 💡 Tips

- **Use Chrome DevTools**: Check console for any errors
- **Network Tab**: Verify no failed requests (all mock data is local)
- **React DevTools**: Inspect component state if needed
- **Lighthouse**: Run audit for performance/accessibility
- **Mobile Testing**: Use DevTools device toolbar or real device

---

**Happy Testing! 🚀**

All modules are complete and ready for comprehensive testing before backend integration.
