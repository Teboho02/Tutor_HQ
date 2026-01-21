import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Store scheduled classes (in production, use a database)
const scheduledClasses = new Map();

// ========================
// Class Management API
// ========================

// Schedule a new class
app.post('/api/classes/schedule', (req, res) => {
    const { title, subject, instructor, students, tutors, startTime, duration, description } = req.body;

    const classId = `class_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const classInfo = {
        id: classId,
        title,
        subject,
        instructor,
        students: students || [],
        tutors: tutors || [],
        startTime: new Date(startTime),
        duration,
        description,
        status: 'scheduled',
        createdAt: new Date(),
    };

    scheduledClasses.set(classId, classInfo);

    console.log(`Class scheduled: ${classId}`, classInfo);

    res.json({
        success: true,
        classId,
        classInfo,
    });
});

// Get a specific class
app.get('/api/classes/:classId', (req, res) => {
    const { classId } = req.params;
    const classInfo = scheduledClasses.get(classId);

    if (!classInfo) {
        return res.status(404).json({ error: 'Class not found' });
    }

    res.json(classInfo);
});

// Get all classes
app.get('/api/classes', (req, res) => {
    const allClasses = Array.from(scheduledClasses.values());
    res.json(allClasses);
});

// ========================
// Video Upload API
// ========================

// Endpoint for compressed video upload
app.post('/api/upload/video', async (req, res) => {
    try {
        const { fileName, fileSize, compressed } = req.body;

        // In production, you would:
        // 1. Receive the video file from the client
        // 2. Store it in cloud storage (e.g., AWS S3, Azure Blob, Supabase)
        // 3. Return the URL for accessing the video

        // Mock response for now
        const videoUrl = `https://storage.example.com/videos/${Date.now()}_${fileName}`;

        console.log(`📹 Video upload request:
            - File: ${fileName}
            - Size: ${fileSize} bytes
            - Compressed: ${compressed ? 'Yes' : 'No'}
        `);

        res.status(200).json({
            success: true,
            message: 'Video uploaded successfully',
            data: {
                url: videoUrl,
                fileName,
                uploadedAt: new Date().toISOString(),
                compressed,
            }
        });
    } catch (error) {
        console.error('Video upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload video',
            error: error.message,
        });
    }
});

// ========================
// Health Check
// ========================

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        scheduledClasses: scheduledClasses.size,
    });
});

// ========================
// Start Server
// ========================

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 API Server running on port ${PORT}`);
    console.log(`📹 Video upload API: http://localhost:${PORT}/api/upload/video`);
    console.log(`📚 Class management API: http://localhost:${PORT}/api/classes`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
