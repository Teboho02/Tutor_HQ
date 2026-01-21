# Calendar & Task Correlation System Documentation

## Current State

The calendar is currently **using mock data** and is **not yet connected** to the actual tasks, goals, tests, or schedule data sources. Here's what exists and what needs to be implemented:

## What Currently Exists

### 1. **StudentCalendar.tsx** (Currently Implemented)
**Location**: `src/pages/users/students/StudentCalendar.tsx`

**Current Data Structure**:
```typescript
interface CalendarEvent {
    id: number;
    type: 'class' | 'assignment' | 'test';
    title: string;
    subject: string;
    date: string;
    time: string;
    description?: string;
    dateObj?: Date;
}
```

**Current Features**:
- ✅ Three view modes: Month, Week, List
- ✅ Color-coded events by type (Blue=Class, Orange=Assignment, Red=Test)
- ✅ Sample hardcoded events

**Sample Events (Mock Data)**:
- Today: Mathematics Live Class at 2:00 PM
- Tomorrow: Math Assignment 5 due at 11:59 PM
- In 2 days: Physics Midterm at 10:00 AM + Chemistry Lab at 3:00 PM
- etc.

---

## What Should Be Implemented (Future)

### 2. **Goals Integration** ❌ NOT IMPLEMENTED
**Source**: `src/types/goals.ts`

Students can create goals with:
- Categories: Academic, Homework, Test Prep, Skill Development, Personal
- Target Dates
- Status: Not Started, In Progress, Completed, Overdue
- Weekly tracking

**What calendar should show**:
- Visual indicators for goals with approaching target dates
- Goal deadlines displayed alongside other events

**Example**: If a student creates goal "Complete Calculus Chapter 5" with target date of Friday, Friday's calendar should show this goal.

---

### 3. **Tasks/Assignments Integration** ❌ NOT IMPLEMENTED
**Your Business Model**: Students have 2 weekly tasks per subject

**What calendar should show**:
- Task assignments from tutors
- Task due dates
- Task descriptions

**Example**: If tutor assigns "Math Task 1: Integration Exercises" with due date Wednesday, Wednesday shows this task.

---

### 4. **Tests/Assessments Integration** ❌ NOT IMPLEMENTED
**Your Business Model**: 1 test per month per subject

**What calendar should show**:
- Monthly tests scheduled by tutors
- Test dates and times
- Test descriptions/chapters covered

**Example**: If tutor schedules "Physics Monthly Test - Chapters 1-5" for the 15th, the calendar marks the 15th with this test.

---

### 5. **Class Schedules Integration** ❌ NOT IMPLEMENTED
**Your Business Model**: Classes can be 1-1 or group sessions

**What calendar should show**:
- Live class sessions scheduled by tutors
- Class type (1-1 or group)
- Class time and duration
- Subject and tutor information

**Example**: If tutor schedules a 1-1 Physics class for Monday 2:00 PM, Monday shows this class.

---

### 6. **Subject Coordinator System** ❌ NOT VISIBLE
**Your Business Model**: Each subject has a subject coordinator (the tutor)

**What needs to be implemented**:
- Display which tutor is the subject coordinator on the calendar
- Filter calendar by subject coordinator
- Show coordinator contact info for questions

**Example**: Mathematics tasks/tests/classes all show "Tutor: Ms. Johnson (Math Coordinator)"

---

## Proposed Calendar Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     STUDENT CALENDAR VIEW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Monday 15th, January                                    │   │
│  │  ─────────────────────────────────────────────────────── │   │
│  │  📚 9:00 AM - Math Live Class (1-1 with Ms. Johnson)    │   │
│  │  📝 Tutor Task: Integration Exercises (Due 11:59 PM)     │   │
│  │  🎯 Personal Goal: Complete Ch 5 Practice (Target: 15th) │   │
│  │  📋 Quiz: Math Quick Assessment (2:00 PM)               │   │
│  │  📚 3:00 PM - Group Physics Class (Dr. Patel)           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Filters: [All] [Classes] [Tasks] [Tests] [Goals]              │
│  View:    [Month] [Week] [List]                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

         ↓ Data Sources ↓

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Class Data     │  │   Task Data      │  │   Test Data      │
│                  │  │                  │  │                  │
│ • Schedule       │  │ • Assignment     │  │ • Monthly Test   │
│ • Tutor          │  │ • Due Date       │  │ • Date & Time    │
│ • 1-1 vs Group   │  │ • Subject        │  │ • Subject        │
│ • Subject        │  │ • Description    │  │ • Tutor          │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐
│   Goal Data      │  │ Subject Coord    │
│                  │  │                  │
│ • Target Date    │  │ • Tutor Name     │
│ • Category       │  │ • Subject        │
│ • Status         │  │ • Contact Info   │
└──────────────────┘  └──────────────────┘
```

---

## Implementation Roadmap

### Phase 1: Connect Existing Data (Tasks list, schedule)
1. Create context/hook for combining tasks, goals, tests, and schedules
2. Fetch data from each source
3. Convert to CalendarEvent format
4. Display in calendar

### Phase 2: Add Filtering
1. Filter by event type (Class/Task/Test/Goal)
2. Filter by subject
3. Filter by tutor/coordinator

### Phase 3: Add Subject Coordinator Display
1. Add tutor information to events
2. Display subject coordinator on calendar
3. Show coordinator contact for support

### Phase 4: Smart Event Grouping
1. Group events by subject on same day
2. Visual indicators for overdue items
3. Highlight high-activity days

---

## Files That Need Updates

1. **StudentCalendar.tsx** - Replace mock data with real data fetching
2. **New file: hooks/useCalendarEvents.ts** - Combine all event sources
3. **New file: types/calendar.ts** - Unified calendar event type
4. **Student Dashboard** - Show calendar widget with upcoming events
5. **Tutor Materials/Schedule pages** - Show what they're assigning to calendar

---

## Benefits of Full Implementation

✅ **Students** see all deadlines in one place - never miss a task
✅ **Tutors** can manage all course activities from one calendar interface
✅ **Parents** can monitor all their child's academic commitments
✅ **System** prevents conflicts (e.g., multiple tests same day)
✅ **Coordination** ensures balanced workload across subjects

---

## Current Mock Data Structure

The calendar currently shows these sample events:
- **Classes**: Mathematics, Physics, Chemistry, English classes at various times
- **Assignments**: Math assignment, Biology paper, Chemistry report
- **Tests**: Physics midterm, Chemistry quiz

**To get real data**, we need API endpoints or data hooks that pull from:
- Student's enrolled classes
- Student's assigned tasks (from tutor)
- Student's created goals
- Monthly tests schedule
- Class schedule
