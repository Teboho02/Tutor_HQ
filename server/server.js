import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

app.use(cors());
app.use(express.json());

// Store active rooms and participants
const rooms = new Map();
const scheduledClasses = new Map();

// Room structure
class Room {
    constructor(classId, classInfo) {
        this.classId = classId;
        this.classInfo = classInfo;
        this.participants = new Map();
        this.screenSharing = null;
        this.createdAt = new Date();
    }

    addParticipant(socketId, userInfo) {
        this.participants.set(socketId, {
            ...userInfo,
            socketId,
            joinedAt: new Date(),
            isMuted: false,
            isVideoOff: false,
        });
    }

    removeParticipant(socketId) {
        this.participants.delete(socketId);
    }

    getParticipants() {
        return Array.from(this.participants.values()).map(p => ({
            ...p,
            id: p.socketId, // Add id field for client compatibility
        }));
    }

    updateParticipant(socketId, updates) {
        const participant = this.participants.get(socketId);
        if (participant) {
            this.participants.set(socketId, { ...participant, ...updates });
        }
    }
}

// API Endpoints
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

    // In production, you'd save this to a database
    console.log(`Class scheduled: ${classId}`, classInfo);

    res.json({
        success: true,
        classId,
        classInfo,
    });
});

app.get('/api/classes/:classId', (req, res) => {
    const { classId } = req.params;
    const classInfo = scheduledClasses.get(classId);

    if (!classInfo) {
        return res.status(404).json({ error: 'Class not found' });
    }

    const room = rooms.get(classId);
    const participants = room ? room.getParticipants() : [];

    res.json({
        ...classInfo,
        participants,
        isActive: room !== null,
    });
});

app.get('/api/classes', (req, res) => {
    const allClasses = Array.from(scheduledClasses.values());
    res.json(allClasses);
});

// Socket.IO Events
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a room
    socket.on('join-room', ({ classId, userInfo }) => {
        console.log(`${userInfo.name} joining room: ${classId}`);

        let room = rooms.get(classId);
        if (!room) {
            const classInfo = scheduledClasses.get(classId) || {
                id: classId,
                title: 'Live Class',
                subject: 'General',
            };
            room = new Room(classId, classInfo);
            rooms.set(classId, room);
        }

        room.addParticipant(socket.id, userInfo);
        socket.join(classId);

        // Send existing participants to the new user
        const otherParticipants = room.getParticipants().filter(p => p.socketId !== socket.id);
        socket.emit('existing-participants', otherParticipants);

        // Notify others about the new participant
        socket.to(classId).emit('user-joined', {
            socketId: socket.id,
            ...userInfo,
        });

        // Send room info to all participants
        io.to(classId).emit('room-info', {
            participantCount: room.participants.size,
            participants: room.getParticipants(),
        });
    });

    // WebRTC signaling
    socket.on('offer', ({ to, offer, from }) => {
        console.log(`Offer from ${from} to ${to}`);
        socket.to(to).emit('offer', { from, offer });
    });

    socket.on('answer', ({ to, answer, from }) => {
        console.log(`Answer from ${from} to ${to}`);
        socket.to(to).emit('answer', { from, answer });
    });

    socket.on('ice-candidate', ({ to, candidate, from }) => {
        socket.to(to).emit('ice-candidate', { from, candidate });
    });

    // Media control updates
    socket.on('toggle-audio', ({ classId, isMuted }) => {
        const room = rooms.get(classId);
        if (room) {
            room.updateParticipant(socket.id, { isMuted });
            socket.to(classId).emit('participant-audio-changed', {
                socketId: socket.id,
                isMuted,
            });
        }
    });

    socket.on('toggle-video', ({ classId, isVideoOff }) => {
        const room = rooms.get(classId);
        if (room) {
            room.updateParticipant(socket.id, { isVideoOff });
            socket.to(classId).emit('participant-video-changed', {
                socketId: socket.id,
                isVideoOff,
            });
        }
    });

    // Screen sharing
    socket.on('start-screen-share', ({ classId }) => {
        const room = rooms.get(classId);
        if (room) {
            room.screenSharing = socket.id;
            io.to(classId).emit('screen-share-started', {
                socketId: socket.id,
            });
        }
    });

    socket.on('stop-screen-share', ({ classId }) => {
        const room = rooms.get(classId);
        if (room) {
            room.screenSharing = null;
            io.to(classId).emit('screen-share-stopped', {
                socketId: socket.id,
            });
        }
    });

    // Chat messages
    socket.on('chat-message', ({ classId, message }) => {
        const room = rooms.get(classId);
        if (room) {
            const participant = room.participants.get(socket.id);
            const messageData = {
                sender: participant?.name || 'Unknown',
                text: message,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                timestamp: Date.now(),
            };
            io.to(classId).emit('chat-message', messageData);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);

        // Find and remove user from all rooms
        rooms.forEach((room, classId) => {
            if (room.participants.has(socket.id)) {
                const participant = room.participants.get(socket.id);
                room.removeParticipant(socket.id);

                // Notify others
                socket.to(classId).emit('user-left', {
                    socketId: socket.id,
                    name: participant.name,
                });

                // Update room info
                io.to(classId).emit('room-info', {
                    participantCount: room.participants.size,
                    participants: room.getParticipants(),
                });

                // Delete room if empty
                if (room.participants.size === 0) {
                    rooms.delete(classId);
                    console.log(`Room ${classId} deleted (empty)`);
                }
            }
        });
    });

    // Leave room
    socket.on('leave-room', ({ classId }) => {
        const room = rooms.get(classId);
        if (room) {
            const participant = room.participants.get(socket.id);
            room.removeParticipant(socket.id);
            socket.leave(classId);

            socket.to(classId).emit('user-left', {
                socketId: socket.id,
                name: participant?.name,
            });

            io.to(classId).emit('room-info', {
                participantCount: room.participants.size,
                participants: room.getParticipants(),
            });

            if (room.participants.size === 0) {
                rooms.delete(classId);
            }
        }
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`🚀 Signaling server running on port ${PORT}`);
});
