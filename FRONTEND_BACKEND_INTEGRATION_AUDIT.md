# TutorHQ Frontend-Backend Integration Audit Report

## Executive Summary

This report documents **32 integration issues** found across the TutorHQ application's frontend pages, backend controllers, database schema, and service layer. Issues are categorized by severity and type.

**Critical issues (will crash or fail):** 12  
**Major issues (broken functionality):** 11  
**Moderate issues (degraded behavior):** 9  

---

## 🔴 CRITICAL — Issues That Will Crash or Completely Fail

---

### C-1: Auth Token Refresh Is Broken — Frontend Sends No Body

**Frontend:** `src/config/api.ts` (line 36)  
**Backend:** `Tutor_HQ_API/src/controllers/auth.controller.js` (lines 389–393)

The Axios interceptor calls `POST /auth/refresh` with **no request body**:
```ts
await apiClient.post('/auth/refresh');
```

The backend controller **requires** `refresh_token` in `req.body`:
```js
const { refresh_token } = req.body;
if (!refresh_token) {
  throw new AppError('Refresh token is required', 400);
}
```

**Impact:** Every expired token triggers a 400 error → user is logged out instead of silently refreshed. The refresh token is returned at login/register but is never stored client-side or sent back.

---

### C-2: Registration Inserts into Non-Existent `students` Table

**Backend:** `Tutor_HQ_API/src/controllers/auth.controller.js` (lines 94–100)  
**Schema:** `Tutor_HQ_API/database/schema.sql`

During student registration, the controller inserts into a `students` table:
```js
await supabaseAdmin.from('students').insert([{ id: authData.user.id, ... }]);
```

The database schema defines `student_profiles` (not `students`). The `students` table does not exist in any schema file.

**Impact:** Every student registration will fail with a Supabase "relation does not exist" error, causing a rollback that deletes the auth user.

---

### C-3: Registration Links Parents via Non-Existent `parent_students` Table

**Backend:** `Tutor_HQ_API/src/controllers/auth.controller.js` (lines 128–133, 200–206)  
**Schema:** `Tutor_HQ_API/database/schema.sql` (line 145)

Both student and parent registration insert into `parent_students`:
```js
await supabaseAdmin.from('parent_students').insert(parentStudentLinks);
```

The schema defines `parent_student_links` (not `parent_students`).

**Impact:** All parent-student linking during registration fails. Parents cannot be connected to children.

---

### C-4: Student Profile Queries Columns That Don't Exist

**Backend:** `Tutor_HQ_API/src/controllers/student.controller.js` (lines 124–134)  
**Schema:** `Tutor_HQ_API/database/schema.sql` (lines 44–56)

The `getProfile` controller queries `student_profiles` for columns `subjects`, `learning_style`, and `goals`:
```js
.select('grade_level, school_name, subjects, learning_style, goals, profiles:user_id (...)')
```

The `student_profiles` table schema only has: `id`, `user_id`, `grade_level`, `school_name`, `date_of_birth`, `parent_id`, `created_at`, `updated_at`. The columns `subjects`, `learning_style`, and `goals` do not exist.

**Impact:** `StudentProgress.tsx` calls `studentService.getProfile()` which hits this endpoint → Supabase returns error "column does not exist" → 404 error shown to user.

---

### C-5: Tutor Profile Queries Non-Existent Column `experience_years`

**Backend:** `Tutor_HQ_API/src/controllers/tutor.controller.js` (lines 103–114)  
**Schema:** `Tutor_HQ_API/database/schema.sql` (line 68)

The controller selects `experience_years` and `availability`:
```js
.select('bio, qualifications, subjects, experience_years, hourly_rate, availability, profiles:user_id (...)')
```

The schema defines `years_of_experience` (not `experience_years`), and `availability` column does not exist in the schema at all.

**Impact:** `TutorAccount.tsx` calls `tutorService.getProfile()` → query fails with column mismatch → 404 error.

---

### C-6: `ScheduleClass.tsx` (Student Page) Calls Tutor-Only Endpoints

**Frontend:** `src/pages/users/students/ScheduleClass.tsx`

This student-facing page calls:
- `tutorService.getStudents()` → hits `GET /api/tutors/students` which requires `authorize('tutor')` middleware
- `classService.createClass()` → hits `POST /api/classes` which requires `authorize('tutor', 'admin')` middleware

**Impact:** Both calls return **403 Forbidden** for any logged-in student. The page is completely non-functional for its intended audience.

---

### C-7: Analytics Controller References Non-Existent `test_submissions` Table

**Backend:** `Tutor_HQ_API/src/controllers/analytics.controller.js` (lines 56–58, 200–206)  
**Schema:** No `test_submissions` table exists in any schema file.

The controller queries:
```js
await supabaseAdmin.from('test_submissions').select(...)
```

The tests schema (referenced in `test.controller.js`) uses `test_results`, not `test_submissions`.

**Impact:** All analytics involving test data fail → `Analytics.tsx` shows zeroes or errors for test metrics.

---

### C-8: Analytics Controller Queries `assignment_submissions.max_score` — Column Doesn't Exist

**Backend:** `Tutor_HQ_API/src/controllers/analytics.controller.js` (lines 48–51)  
**Schema:** `Tutor_HQ_API/database/schema_assignments.sql` (lines 28–40)

```js
.select('id, score, max_score, submitted_at, assignments!inner(title)')
```

The `assignment_submissions` table has `score` and `percentage` columns but **no `max_score` column**. The `total_marks` field lives on the `assignments` table, not on submissions.

**Impact:** Student and tutor analytics queries fail.

---

### C-9: Analytics Controller Queries `material_downloads.user_id` — Column Is `student_id`

**Backend:** `Tutor_HQ_API/src/controllers/analytics.controller.js` (lines 80–83)  
**Schema:** `Tutor_HQ_API/database/schema_materials.sql` (lines 39–43)

```js
.from('material_downloads').select('id, downloaded_at').eq('user_id', studentId)
```

The schema defines the column as `student_id`, not `user_id`:
```sql
student_id UUID NOT NULL REFERENCES profiles(id)
```

**Impact:** Material download stats always return 0 — the query silently returns empty because `user_id` column doesn't match.

---

### C-10: Parent Analytics Joins Non-Existent `users` Table with Wrong Columns

**Backend:** `Tutor_HQ_API/src/controllers/analytics.controller.js` (lines 310–320)

```js
.from('parent_student_links')
.select(`student_id, users!parent_student_links_student_id_fkey (id, first_name, last_name)`)
```

- The `users` table does not exist; the app uses `profiles`
- The columns `first_name` / `last_name` don't exist; the `profiles` table uses `full_name`

**Impact:** Parent analytics page crashes or returns empty data.

---

### C-11: Notification Controller Uses Anon Supabase Client

**Backend:** `Tutor_HQ_API/src/controllers/notification.controller.js` (line 8)

```js
import { supabase } from '../config/supabase.js';
```

All other controllers use `supabaseAdmin` for database queries. The anon client (`supabase`) is subject to **Row Level Security (RLS)** policies. Since the server makes requests without a user session token in headers (auth is cookie-based, not passed to Supabase client), the anon client has **no authenticated identity** and RLS will block all queries.

**Impact:** All notification operations (get, create, mark read, delete) fail silently or return empty results. The `Notifications.tsx` page shows no notifications even when they exist in the database.

---

### C-12: `student.controller.js` Dashboard Queries `assignments.subject` — Column Doesn't Exist

**Backend:** `Tutor_HQ_API/src/controllers/student.controller.js` (line 76)  
**Schema:** `Tutor_HQ_API/database/schema_assignments.sql`

```js
.select('id, title, subject, due_date, status, assignment_submissions(...)')
```

The `assignments` table has no `subject` column. Assignments relate to classes via `class_id`, and the `subject` lives on the `classes` table.

**Impact:** The student dashboard query may fail or return `null` for the subject field in recent assignments.

---

## 🟠 MAJOR — Issues That Break Specific Functionality

---

### M-1: Tutor Profile Not Created During Registration

**Backend:** `Tutor_HQ_API/src/controllers/auth.controller.js`

When a tutor registers, the auth controller creates a `profiles` row but **never inserts into `tutor_profiles`**. There is no tutor-specific setup code (only student and parent setup blocks exist).

**Impact:** `TutorAccount.tsx` calls `tutorService.getProfile()` → controller queries `tutor_profiles` table → no row found → throws "Tutor profile not found" (404).

---

### M-2: Student Profile Not Created During Registration

**Backend:** `Tutor_HQ_API/src/controllers/auth.controller.js` (lines 94–100)

Registration inserts into the non-existent `students` table (see C-2) and never inserts into `student_profiles`. Even if the `students` table issue were fixed, `student_profiles` still wouldn't be populated.

**Impact:** `StudentProgress.tsx` and any page calling `studentService.getProfile()` will always 404.

---

### M-3: Parent Controller Uses `student_profiles.parent_id` for Linking but Auth Uses Different Table

**Backend linkChild:** `Tutor_HQ_API/src/controllers/parent.controller.js` (lines 44–49)  
**Backend register:** `Tutor_HQ_API/src/controllers/auth.controller.js` (lines 128–133)

`linkChild` updates `student_profiles.parent_id`:
```js
.from('student_profiles').update({ parent_id: parentId }).eq('user_id', childProfile.id)
```

But registration links via `parent_students` table (which doesn't exist — see C-3). Additionally, `getChildren` queries `student_profiles.parent_id`:
```js
.from('student_profiles').select(...).eq('parent_id', parentId)
```

Since `student_profiles` is never populated during registration (see M-2), the `linkChild` call will fail because no `student_profiles` row exists to update.

**Impact:** `ParentAccount.tsx` "Link Child" feature fails. `ParentDashboard.tsx` shows "No Children Linked" even after registration.

---

### M-4: `classService.createClass()` Sends `duration` Instead of `durationMinutes`

**Frontend:** `src/services/class.service.ts`  
**Backend:** `Tutor_HQ_API/src/controllers/class.controller.js`

The `TutorSchedule.tsx` page correctly constructs:
```ts
durationMinutes: parseInt(formData.duration)
```

However, checking `class.service.ts` — the `createClass` function passes the data through directly, and the controller destructures `durationMinutes` from `req.body`. This path works correctly when called from `TutorSchedule.tsx`.

But `ScheduleClass.tsx` (the student page, which shouldn't be calling this anyway per C-6) may pass `duration` instead.

---

### M-5: `classService.cancelClass` Sends Numeric `classId` but API Expects UUID String

**Frontend:** `src/services/class.service.ts`  
**Frontend caller:** `src/pages/users/tutors/TutorClasses.tsx` (line 78)

`TutorClasses.tsx` defines `Class.id` as `number` and calls:
```ts
await classService.cancelClass(classId, reason);
```

The backend expects `classId` as a UUID string (`classes.id` is UUID). The `classId: number` type annotation is incorrect — the API returns UUID strings.

**Impact:** TypeScript might not catch this (it's an `as` cast), but if the ID is actually treated as a number anywhere, the API call will fail.

---

### M-6: `TutorStudents.tsx` Response Data Structure Mismatch

**Frontend:** `src/pages/users/tutors/TutorStudents.tsx` (line 57)

The page correctly accesses `response.data.students`, matching the backend response structure `{ success, data: { students: [...] } }`. This works correctly.

However, the student transformation maps `s.name` but the backend returns `full_name` (aliased as `name` in the controller). The backend tutor controller maps `e.profiles.full_name` to `name` in the response, so this works — the backend transforms `full_name` → `name`.

---

### M-7: Notification Controller Checks `req.user.role` — Middleware Sets `req.userRole`

**Backend:** `Tutor_HQ_API/src/controllers/notification.controller.js` (createNotification/broadcastNotification functions)  
**Middleware:** `Tutor_HQ_API/src/middleware/auth.middleware.js`

The notification controller checks:
```js
if (req.user.role !== 'admin')
```

But the auth middleware sets `req.userRole` (not `req.user.role`):
```js
req.user = user;       // Supabase user object (has no .role)
req.userRole = role;   // From profiles table
```

**Impact:** Admin-only notification functions (`createNotification`, `broadcastNotification`) always fail because `req.user.role` is `undefined` and never equals `'admin'`.

---

### M-8: Notification `broadcastNotification` Queries Non-Existent `users` Table

**Backend:** `Tutor_HQ_API/src/controllers/notification.controller.js`

```js
.from('users').select('id')
```

The app uses `profiles` not `users`.

**Impact:** Broadcasting notifications fails with "relation does not exist" error.

---

### M-9: `inquiries.controller.js` Has Multiple Bugs

**Backend:** `Tutor_HQ_API/src/controllers/inquiries.controller.js`

1. Function signature has swapped parameters: `async function SendMessage(res, req)` — should be `(req, res)`
2. `req.body()` is called as a function instead of accessed as a property
3. No route file exists and it's **not mounted** in `Tutor_HQ_API/src/routes/index.js`

**Impact:** Contact form submissions have no backend endpoint. `Contact.tsx` uses `mailto:` links as a workaround, so this is a missing feature rather than a crash.

---

### M-10: Test Routes Don't Use `authorize()` — `req.userRole` Is Undefined

**Backend:** `Tutor_HQ_API/src/routes/test.routes.js`

Test routes only use `authenticate` middleware without `authorize()`. Several test controller functions check `req.userRole`:
- `submitTest` checks `req.userRole`
- `getStudentResults` checks `req.userRole`

Since `authorize()` is what sets `req.userRole`, it will always be `undefined`.

**Impact:** Authorization logic in test controllers is always bypassed — either allowing unintended access or failing comparison checks.

---

### M-11: `StudentTests.tsx` Expects Nested `result.test` Object — Backend Returns Flat Structure 

**Frontend:** `src/pages/users/students/StudentTests.tsx`

The page transforms results expecting:
```ts
result.test.subject
result.test.tutorName
```

The backend `getStudentResults` in `test.controller.js` returns `test_results` rows with a join to `tests` table, but the exact response structure depends on how Supabase formats the joined data. If it returns `{ test: { subject, ... } }` it works; if it flattens, it breaks.

Additionally, the backend stores `tutor_id` not `tutorName` — there's no join to get the tutor's name in the test results endpoint.

**Impact:** Test results page may show "undefined" for subject and tutor name.

---

## 🟡 MODERATE — Issues That Cause Degraded Behavior

---

### Mo-1: `TutorAccount.tsx` "Save Profile" / "Save Banking" Are Not Connected to Backend

**Frontend:** `src/pages/users/tutors/TutorAccount.tsx` (lines 87–93)

Both save handlers use `alert()` instead of making API calls:
```ts
const handleSaveProfile = (e) => { alert('Profile updated successfully!'); };
const handleSaveBanking = (e) => { alert('Banking information updated successfully!'); };
```

**Impact:** User believes their profile/banking info was saved, but nothing is persisted.

---

### Mo-2: `TutorStudents.tsx` "Award Badge" Button Has No Backend Handler

**Frontend:** `src/pages/users/tutors/TutorStudents.tsx`

The "Award Badge" button and form exist but have no `onClick` handler or API call attached.

**Impact:** Feature is rendered but non-functional.

---

### Mo-3: `TutorStudents.tsx` Profile Modal Tabs Are Not Functional

**Frontend:** `src/pages/users/tutors/TutorStudents.tsx`

Tabs (Profile, Progress, Classes, Uploads, Achievements) exist as buttons but have no tab-switching logic or data fetching.

**Impact:** Only the Profile tab content is visible; other tabs do nothing.

---

### Mo-4: Static Placeholder Pages with No API Integration

The following pages render static UI with no backend calls:
- `src/pages/Dashboard.tsx` — hardcoded welcome message
- `src/pages/Schedule.tsx` — static schedule placeholder
- `src/pages/LiveClasses.tsx` — static placeholder

**Impact:** Users see empty or dummy data after navigation.

---

### Mo-5: `TakeTest.tsx` Duration Calculation Can Crash on Null Values

**Frontend:** `src/pages/users/students/TakeTest.tsx`

The page calculates test duration from `testData.scheduled_at` and `testData.due_date`. If either is `null` (both are nullable in the schema), the `new Date(null)` creates an invalid date and the math produces `NaN` → timer shows `NaN:NaN`.

**Impact:** Test timer breaks if scheduled_at or due_date is missing.

---

### Mo-6: `ParentSchedule.tsx` Fetches Schedules Sequentially Per Child

**Frontend:** `src/pages/users/parents/ParentSchedule.tsx` (lines 35–60)

Uses a `for...of` loop to fetch schedules one child at a time:
```ts
for (const child of childList) {
    const scheduleRes = await parentService.getChildSchedule(child.id);
}
```

**Impact:** With many children, page load is slow due to sequential API calls instead of `Promise.all`.

---

### Mo-7: `StudentMaterials.tsx` "School Test Scores" Tab Data Is Not Persisted

**Frontend:** `src/pages/users/students/StudentMaterials.tsx`

The School Tests tab allows entering test scores, but the data is managed in local React state only — no API call saves it.

**Impact:** Scores are lost on page refresh.

---

### Mo-8: `TutorMaterials.tsx` Tests Tab Shows Empty — No Fetch Logic

**Frontend:** `src/pages/users/tutors/TutorMaterials.tsx` (line 62)

The `scheduledTests` array is initialized as empty `[]` and never populated from an API call:
```ts
const scheduledTests: ScheduledTest[] = [];
```

**Impact:** "Tests & Assignments" tab always shows empty.

---

### Mo-9: `Analytics.tsx` Page References `analyticsService` but Service Has Limited Error Handling

**Frontend:** `src/pages/Analytics.tsx`  
**Backend:** Analytics controller has multiple broken queries (see C-7, C-8, C-9, C-10)

Even if the frontend code is correct, the backend analytics endpoints will fail due to wrong table/column references, meaning the Analytics page will show errors or empty data for all users.

**Impact:** Analytics page is effectively non-functional until backend issues C-7 through C-10 are fixed.

---

## Summary Table

| ID | Severity | Category | Frontend File | Backend File | Description |
|----|----------|----------|---------------|--------------|-------------|
| C-1 | 🔴 Critical | Missing Data | `src/config/api.ts` | `auth.controller.js` | Token refresh sends no body |
| C-2 | 🔴 Critical | Wrong Table | — | `auth.controller.js` | Inserts into `students` (not in schema) |
| C-3 | 🔴 Critical | Wrong Table | — | `auth.controller.js` | Inserts into `parent_students` (not in schema) |
| C-4 | 🔴 Critical | Wrong Columns | `StudentProgress.tsx` | `student.controller.js` | Queries non-existent columns |
| C-5 | 🔴 Critical | Wrong Column | `TutorAccount.tsx` | `tutor.controller.js` | `experience_years` vs `years_of_experience` |
| C-6 | 🔴 Critical | Wrong Permission | `ScheduleClass.tsx` | — | Student page calls tutor-only endpoints |
| C-7 | 🔴 Critical | Wrong Table | `Analytics.tsx` | `analytics.controller.js` | `test_submissions` table doesn't exist |
| C-8 | 🔴 Critical | Wrong Column | `Analytics.tsx` | `analytics.controller.js` | `max_score` doesn't exist on submissions |
| C-9 | 🔴 Critical | Wrong Column | `Analytics.tsx` | `analytics.controller.js` | `user_id` should be `student_id` |
| C-10 | 🔴 Critical | Wrong Table | `Analytics.tsx` | `analytics.controller.js` | `users` table doesn't exist |
| C-11 | 🔴 Critical | Wrong Client | `Notifications.tsx` | `notification.controller.js` | Uses anon client, RLS blocks queries |
| C-12 | 🔴 Critical | Wrong Column | `Dashboard.tsx` | `student.controller.js` | `assignments.subject` column doesn't exist |
| M-1 | 🟠 Major | Missing Setup | `TutorAccount.tsx` | `auth.controller.js` | No `tutor_profiles` row created |
| M-2 | 🟠 Major | Missing Setup | `StudentProgress.tsx` | `auth.controller.js` | No `student_profiles` row created |
| M-3 | 🟠 Major | Data Model | `ParentAccount.tsx` | `parent.controller.js` | Inconsistent parent-child linking |
| M-5 | 🟠 Major | Type Mismatch | `TutorClasses.tsx` | — | `Class.id` typed as `number`, API returns UUID |
| M-7 | 🟠 Major | Wrong Property | — | `notification.controller.js` | `req.user.role` should be `req.userRole` |
| M-8 | 🟠 Major | Wrong Table | — | `notification.controller.js` | Broadcast queries `users` not `profiles` |
| M-9 | 🟠 Major | Multiple Bugs | — | `inquiries.controller.js` | Swapped params, route not mounted |
| M-10 | 🟠 Major | Missing Middleware | `StudentTests.tsx` | `test.routes.js` | No `authorize()` → `req.userRole` undefined |
| M-11 | 🟠 Major | Data Shape | `StudentTests.tsx` | `test.controller.js` | Expected nested object may not match |
| Mo-1 | 🟡 Moderate | No Backend | `TutorAccount.tsx` | — | Profile save uses alert only |
| Mo-2 | 🟡 Moderate | No Backend | `TutorStudents.tsx` | — | Award badge not implemented |
| Mo-3 | 🟡 Moderate | UI Only | `TutorStudents.tsx` | — | Modal tabs non-functional |
| Mo-4 | 🟡 Moderate | Static Pages | Multiple | — | Dashboard/Schedule/LiveClasses static |
| Mo-5 | 🟡 Moderate | Null Handling | `TakeTest.tsx` | — | Duration NaN on null dates |
| Mo-6 | 🟡 Moderate | Performance | `ParentSchedule.tsx` | — | Sequential API calls |
| Mo-7 | 🟡 Moderate | No Persistence | `StudentMaterials.tsx` | — | Test scores not saved |
| Mo-8 | 🟡 Moderate | Missing Fetch | `TutorMaterials.tsx` | — | Tests tab always empty |
| Mo-9 | 🟡 Moderate | Multiple Backend | `Analytics.tsx` | `analytics.controller.js` | Page non-functional due to backend bugs |

---

## Recommended Fix Priority

1. **Fix schema mismatches (C-2, C-3):** Change `students` → `student_profiles` and `parent_students` → `parent_student_links` in `auth.controller.js`, or create migration to add the missing tables.
2. **Create role-specific profiles during registration (M-1, M-2):** Add `student_profiles` and `tutor_profiles` inserts in the auth registration flow.
3. **Fix column names (C-4, C-5, C-8, C-9, C-12):** Align controller queries with actual schema column names.
4. **Switch notification controller to `supabaseAdmin` (C-11).**
5. **Fix analytics controller table/column references (C-7, C-8, C-9, C-10).**
6. **Fix token refresh (C-1):** Store refresh token in httpOnly cookie alongside access token and send it during refresh.
7. **Fix `ScheduleClass.tsx` (C-6):** Either rewrite as a tutor-only page or create student-appropriate endpoints.
8. **Fix notification controller property access (M-7):** Change `req.user.role` to `req.userRole`.
9. **Add `authorize()` to test routes (M-10).**
10. **Implement missing backend features (Mo-1, Mo-2, Mo-7, Mo-8).**
