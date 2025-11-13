# Database Setup

This directory contains the database schema for the Tutor HQ application using Supabase PostgreSQL.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned
3. Note down your project URL and anon/public key

### 2. Run the Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `schema.sql`
3. Paste and run the SQL to create all tables, indexes, and policies

### 3. Configure Environment Variables

Add the following to your `.env` file in the server directory:

```
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Schema Overview

### Core Tables

- **profiles**: User profiles extending Supabase auth.users
- **students**: Student-specific information
- **tutors**: Tutor-specific information
- **parent_students**: Parent-student relationships

### Educational Tables

- **classes**: Tutoring sessions and classes
- **class_enrollments**: Student enrollments in classes
- **tests**: Tests, quizzes, and assignments
- **test_assignments**: Assignment of tests to students
- **test_submissions**: Student test submissions
- **materials**: Study materials and resources

### Communication & Tracking

- **messages**: Direct messaging between users
- **notifications**: System notifications
- **student_progress**: Progress tracking metrics
- **reviews**: Tutor reviews and ratings
- **payments**: Payment transactions

## Row Level Security (RLS)

All tables have RLS enabled. The schema includes basic policies that:
- Allow users to view public data
- Restrict updates to own data
- Protect sensitive information

You can customize these policies in the Supabase dashboard under Authentication > Policies.

## Triggers and Functions

The schema includes several automated functions:
- Auto-update `updated_at` timestamps
- Auto-create profiles on user signup
- Auto-calculate tutor ratings from reviews
