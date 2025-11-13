# Tutor HQ Backend Server

Express.js backend server with Supabase authentication and PostgreSQL database for the Tutor HQ platform.

## Features

- **Authentication**: Supabase Auth with JWT tokens
- **Database**: PostgreSQL via Supabase with Row Level Security
- **Real-time Video**: WebRTC signaling server with Socket.IO
- **RESTful API**: Complete CRUD operations for all resources
- **Role-based Access Control**: Student, Tutor, Parent, and Admin roles

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Real-time**: Socket.IO
- **Language**: JavaScript (ES Modules)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Install dependencies:
```bash
cd server
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Edit `.env` and add your Supabase credentials:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CLIENT_URL=http://localhost:5173
```

4. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Copy and run the SQL from `database/schema.sql`

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Documentation

Base URL: `http://localhost:3001/api`

### Authentication Routes (`/api/auth`)

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "role": "student",
  "gradeLevel": "10th Grade",
  "school": "Example High School"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Returns:
```json
{
  "message": "Login successful",
  "user": { ... },
  "session": {
    "access_token": "jwt_token_here",
    "refresh_token": "refresh_token_here"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### User Routes (`/api/users`)

#### Get User Profile
```http
GET /api/users/profile/:userId
Authorization: Bearer <access_token>
```

#### Update User Profile
```http
PUT /api/users/profile/:userId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "phone": "+1234567890",
  "bio": "Passionate about learning"
}
```

#### Get All Tutors
```http
GET /api/users/tutors?subject=Math&minRating=4.0
```

#### Get Tutor Details
```http
GET /api/users/tutors/:tutorId
```

#### Update Tutor Profile
```http
PUT /api/users/tutors/:tutorId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "subjects": ["Math", "Physics"],
  "hourlyRate": 50.00,
  "qualifications": "PhD in Mathematics"
}
```

#### Search Users
```http
GET /api/users/search?query=john&role=student
Authorization: Bearer <access_token>
```

### Class Routes (`/api/classes`)

#### Get All Classes
```http
GET /api/classes?tutorId=xxx&status=scheduled&subject=Math
```

#### Get Class Details
```http
GET /api/classes/:classId
```

#### Create Class (Tutors only)
```http
POST /api/classes
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Algebra Basics",
  "subject": "Math",
  "description": "Introduction to algebra",
  "startTime": "2024-12-01T10:00:00Z",
  "endTime": "2024-12-01T11:00:00Z",
  "duration": 60,
  "maxStudents": 10,
  "isGroup": true
}
```

#### Update Class
```http
PUT /api/classes/:classId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Enroll in Class (Students only)
```http
POST /api/classes/:classId/enroll
Authorization: Bearer <access_token>
```

#### Unenroll from Class
```http
DELETE /api/classes/:classId/enroll
Authorization: Bearer <access_token>
```

### Test Routes (`/api/tests`)

#### Get All Tests
```http
GET /api/tests?tutorId=xxx&subject=Math&testType=quiz
Authorization: Bearer <access_token>
```

#### Get Test Details
```http
GET /api/tests/:testId
Authorization: Bearer <access_token>
```

#### Create Test (Tutors only)
```http
POST /api/tests
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Algebra Quiz 1",
  "subject": "Math",
  "testType": "quiz",
  "questions": [
    {
      "id": 1,
      "question": "What is 2+2?",
      "type": "multiple_choice",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": 1,
      "points": 5
    }
  ],
  "totalPoints": 100,
  "duration": 30,
  "dueDate": "2024-12-15T23:59:59Z"
}
```

#### Assign Test to Students
```http
POST /api/tests/:testId/assign
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "studentIds": ["student_id_1", "student_id_2"],
  "dueDate": "2024-12-15T23:59:59Z"
}
```

#### Get Student Assignments
```http
GET /api/tests/assignments/student/:studentId?status=assigned
Authorization: Bearer <access_token>
```

#### Submit Test
```http
POST /api/tests/assignments/:assignmentId/submit
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "answers": [
    {
      "questionId": 1,
      "answer": 1
    }
  ]
}
```

#### Grade Submission (Tutors only)
```http
PUT /api/tests/submissions/:submissionId/grade
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "score": 85,
  "feedback": "Great work! Review question 5."
}
```

## WebRTC / Video Calls

The server includes a Socket.IO signaling server for WebRTC video calls.

### Socket.IO Events

#### Client → Server

- `join-room`: Join a video call room
  ```javascript
  socket.emit('join-room', {
    classId: 'class_id_here',
    userInfo: { name: 'John Doe', role: 'student' }
  });
  ```

- `offer`: Send WebRTC offer
- `answer`: Send WebRTC answer
- `ice-candidate`: Send ICE candidate
- `toggle-audio`: Toggle audio on/off
- `toggle-video`: Toggle video on/off
- `start-screen-share`: Start screen sharing
- `stop-screen-share`: Stop screen sharing
- `chat-message`: Send chat message
- `leave-room`: Leave the room

#### Server → Client

- `existing-participants`: List of participants already in room
- `user-joined`: New user joined the room
- `user-left`: User left the room
- `room-info`: Updated room information
- `offer`: Received WebRTC offer
- `answer`: Received WebRTC answer
- `ice-candidate`: Received ICE candidate
- `participant-audio-changed`: Participant muted/unmuted
- `participant-video-changed`: Participant turned video on/off
- `screen-share-started`: Screen sharing started
- `screen-share-stopped`: Screen sharing stopped
- `chat-message`: Received chat message

## Authentication

All protected routes require a JWT token in the Authorization header:

```http
Authorization: Bearer <access_token>
```

The token is returned from the `/api/auth/login` endpoint.

## Role-based Access Control

Different routes have different role requirements:

- **Public**: No authentication required
- **Authenticated**: Any logged-in user
- **Student**: Student role required
- **Tutor**: Tutor role required
- **Admin**: Admin role required
- **Ownership**: User can only access their own resources

## Error Responses

All errors follow this format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "details": ["Optional array of validation errors"]
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized (not logged in)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Database Schema

See `database/schema.sql` and `database/README.md` for complete database schema documentation.

## Development

### Project Structure

```
server/
├── config/
│   └── supabase.js         # Supabase client configuration
├── middleware/
│   └── auth.js             # Authentication middleware
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── users.js            # User management routes
│   ├── classes.js          # Class management routes
│   └── tests.js            # Test/assignment routes
├── database/
│   ├── schema.sql          # Database schema
│   └── README.md           # Database documentation
├── server.js               # Main server file
├── package.json            # Dependencies
├── .env.example            # Example environment variables
└── README.md               # This file
```

### Adding New Routes

1. Create a new route file in `routes/`
2. Import it in `server.js`
3. Add it to the Express app with `app.use()`

### Running Tests

```bash
npm test
```

## Deployment

### Environment Variables

Ensure all required environment variables are set in production:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CLIENT_URL`
- `PORT`

### Production Considerations

1. Enable HTTPS
2. Set up proper CORS policies
3. Implement rate limiting
4. Add request logging
5. Set up monitoring and alerts
6. Use environment-specific configurations
7. Implement proper error handling and logging

## Support

For issues and questions, please contact the development team or create an issue in the project repository.

## License

Private - All rights reserved
