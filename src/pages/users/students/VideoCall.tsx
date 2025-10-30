import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import './VideoCall.css';

interface Participant {
    id: string;
    name: string;
    role?: string;
    stream?: MediaStream;
    isMuted: boolean;
    isVideoOff: boolean;
}

interface ChatMessage {
    sender: string;
    text: string;
    time: string;
}

const VideoCall: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatMessage, setChatMessage] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const screenShareRef = useRef<MediaStream | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
    const participantRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
    const hasInitialized = useRef(false);

    const classDetails = {
        title: 'Mathematics Live Class',
        subject: 'Advanced Calculus',
        instructor: 'Dr. Smith',
        startTime: '2:00 PM',
    };

    const currentUser = {
        name: 'Student Name', // Would come from auth context
        role: 'student',
    };

    // Initialize Socket.IO and WebRTC
    useEffect(() => {
        // Prevent multiple initializations
        if (hasInitialized.current) return;

        let mounted = true;
        let stream: MediaStream | null = null;

        const initCall = async () => {
            try {
                // Get local media stream
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
                });

                if (!mounted) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                hasInitialized.current = true;
                setLocalStream(stream);

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Connect to signaling server
                const socket = io('http://localhost:3001');
                socketRef.current = socket;

                // Wait for connection before joining
                socket.on('connect', () => {
                    console.log('Connected to signaling server with ID:', socket.id);

                    // Join room
                    socket.emit('join-room', {
                        classId,
                        userInfo: { name: currentUser.name, role: currentUser.role },
                    });
                });

                // Handle existing participants
                socket.on('existing-participants', (existingParticipants: Participant[]) => {
                    console.log('Existing participants:', existingParticipants);

                    // Add all existing participants to state
                    setParticipants(existingParticipants);

                    // Create peer connections for each
                    if (stream) {
                        existingParticipants.forEach((participant) => {
                            createPeerConnection(participant.id, stream, true);
                        });
                    }
                });

                // Handle new user joined
                socket.on('user-joined', ({ socketId, userInfo }: { socketId: string; userInfo: { name: string; role: string } }) => {
                    console.log('User joined:', socketId, userInfo);
                    setParticipants((prev) => [
                        ...prev,
                        { id: socketId, name: userInfo.name, role: userInfo.role, isMuted: false, isVideoOff: false },
                    ]);
                    if (stream) {
                        createPeerConnection(socketId, stream, false);
                    }
                });

                // Handle WebRTC offer
                socket.on('offer', async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
                    console.log('Received offer from:', from);

                    // Create peer connection if it doesn't exist
                    let pc = peersRef.current.get(from);
                    if (!pc && stream) {
                        pc = createPeerConnection(from, stream, false) || undefined;
                    }

                    if (pc) {
                        await pc.setRemoteDescription(new RTCSessionDescription(offer));
                        const answer = await pc.createAnswer();
                        await pc.setLocalDescription(answer);
                        socket.emit('answer', { to: from, answer, from: socket.id });
                    }
                });

                // Handle WebRTC answer
                socket.on('answer', async ({ from, answer }: { from: string; answer: RTCSessionDescriptionInit }) => {
                    console.log('Received answer from:', from);
                    const pc = peersRef.current.get(from);
                    if (pc) {
                        await pc.setRemoteDescription(new RTCSessionDescription(answer));
                    }
                });

                // Handle ICE candidate
                socket.on('ice-candidate', async ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
                    const pc = peersRef.current.get(from);
                    if (pc && candidate) {
                        await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                });

                // Handle user left
                socket.on('user-left', ({ socketId }: { socketId: string }) => {
                    console.log('User left:', socketId);
                    const pc = peersRef.current.get(socketId);
                    if (pc) {
                        pc.close();
                        peersRef.current.delete(socketId);
                    }
                    setParticipants((prev) => prev.filter((p) => p.id !== socketId));
                });

                // Handle chat messages
                socket.on('chat-message', ({ sender, message, timestamp }: { sender: string; message: string; timestamp: string }) => {
                    setMessages((prev) => [...prev, { sender, text: message, time: new Date(timestamp).toLocaleTimeString() }]);
                });

                // Handle participant audio/video changes
                socket.on('participant-audio-changed', ({ socketId, isMuted }: { socketId: string; isMuted: boolean }) => {
                    setParticipants((prev) => prev.map((p) => (p.id === socketId ? { ...p, isMuted } : p)));
                });

                socket.on('participant-video-changed', ({ socketId, isVideoOff }: { socketId: string; isVideoOff: boolean }) => {
                    setParticipants((prev) => prev.map((p) => (p.id === socketId ? { ...p, isVideoOff } : p)));
                });

            } catch (error) {
                console.error('Error initializing call:', error);
                alert('Could not access camera/microphone. Please check permissions.');
            }
        };

        initCall();

        // Cleanup
        return () => {
            mounted = false;
            console.log('Cleaning up video call...');
            stream?.getTracks().forEach((track) => track.stop());
            screenShareRef.current?.getTracks().forEach((track) => track.stop());
            peersRef.current.forEach((pc) => pc.close());
            peersRef.current.clear();
            if (socketRef.current) {
                socketRef.current.emit('leave-room', { classId });
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    // Create peer connection
    const createPeerConnection = (socketId: string, stream: MediaStream | null, isInitiator: boolean) => {
        if (!stream) return null;
        
        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
            ],
        };

        const pc = new RTCPeerConnection(configuration);
        peersRef.current.set(socketId, pc);

        // Add local stream tracks
        stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
        });

        // Handle incoming stream
        pc.ontrack = (event) => {
            console.log('Received track from:', socketId);
            const remoteStream = event.streams[0];
            setParticipants((prev) =>
                prev.map((p) => (p.id === socketId ? { ...p, stream: remoteStream } : p))
            );
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                socketRef.current.emit('ice-candidate', {
                    to: socketId,
                    candidate: event.candidate,
                    from: socketRef.current.id,
                });
            }
        };

        // Initiator creates offer
        if (isInitiator) {
            pc.createOffer()
                .then((offer) => pc.setLocalDescription(offer))
                .then(() => {
                    if (socketRef.current) {
                        socketRef.current.emit('offer', {
                            to: socketId,
                            offer: pc.localDescription,
                            from: socketRef.current.id,
                        });
                    }
                })
                .catch((error) => console.error('Error creating offer:', error));
        }

        return pc;
    };

    // Toggle mute
    const toggleMute = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
                socketRef.current?.emit('toggle-audio', { classId, isMuted: !audioTrack.enabled });
            }
        }
    };

    // Toggle video
    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
                socketRef.current?.emit('toggle-video', { classId, isVideoOff: !videoTrack.enabled });
            }
        }
    };

    // Toggle screen share
    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: { displaySurface: 'monitor' } as any,
                    audio: false,
                });

                screenShareRef.current = screenStream;

                // Replace video track for all peer connections
                const screenTrack = screenStream.getVideoTracks()[0];
                peersRef.current.forEach((pc) => {
                    const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
                    if (sender) {
                        sender.replaceTrack(screenTrack);
                    }
                });

                // Update local video
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = screenStream;
                }

                setIsScreenSharing(true);
                socketRef.current?.emit('start-screen-share', { classId });

                // Handle screen share stopped
                screenTrack.onended = () => {
                    stopScreenShare();
                };
            } catch (error) {
                console.error('Error sharing screen:', error);
            }
        } else {
            stopScreenShare();
        }
    };

    const stopScreenShare = () => {
        if (screenShareRef.current && localStream) {
            screenShareRef.current.getTracks().forEach((track) => track.stop());

            // Restore camera video
            const videoTrack = localStream.getVideoTracks()[0];
            peersRef.current.forEach((pc) => {
                const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
                if (sender) {
                    sender.replaceTrack(videoTrack);
                }
            });

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStream;
            }

            setIsScreenSharing(false);
            socketRef.current?.emit('stop-screen-share', { classId });
        }
    };

    // Send chat message
    const sendMessage = () => {
        if (chatMessage.trim() && socketRef.current) {
            socketRef.current.emit('chat-message', {
                message: chatMessage,
                sender: currentUser.name,
            });
            setChatMessage('');
        }
    };

    // Toggle fullscreen
    const toggleFullscreen = () => {
        const elem = document.querySelector('.main-video-wrapper');
        if (!isFullscreen && elem) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
                setIsFullscreen(true);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    // Leave call
    const leaveCall = () => {
        localStream?.getTracks().forEach((track) => track.stop());
        screenShareRef.current?.getTracks().forEach((track) => track.stop());
        peersRef.current.forEach((pc) => pc.close());
        socketRef.current?.emit('leave-room');
        socketRef.current?.disconnect();
        navigate('/student/live-classes');
    };

    // Update participant video ref when stream changes
    useEffect(() => {
        participants.forEach((participant) => {
            const videoElement = participantRefs.current.get(participant.id);
            if (videoElement && participant.stream) {
                videoElement.srcObject = participant.stream;
            }
        });
    }, [participants]);

    return (
        <div className="video-call-container">
            {/* Header */}
            <div className="call-header">
                <div className="call-info">
                    <h2>{classDetails.title}</h2>
                    <p>{classDetails.subject} • {classDetails.instructor}</p>
                </div>
                <div className="call-status">
                    <span className="live-indicator">● LIVE</span>
                    <span className="call-time">{classDetails.startTime}</span>
                </div>
            </div>

            {/* Video Grid */}
            <div className="video-grid">
                <div className="main-video-wrapper">
                    <video
                        ref={localVideoRef}
                        className="main-video"
                        autoPlay
                        playsInline
                        muted
                    />
                    {isVideoOff && (
                        <div className="video-placeholder">
                            <div className="placeholder-icon">📹</div>
                            <p>Camera is off</p>
                        </div>
                    )}
                    <div className="video-overlay">
                        <span className="participant-name">{currentUser.name} (You)</span>
                    </div>
                </div>

                {participants.length > 0 && (
                    <div className="participants-grid">
                        {participants.map((participant) => (
                            <div key={participant.id} className="participant-video-wrapper">
                                <video
                                    ref={(el) => {
                                        if (el) participantRefs.current.set(participant.id, el);
                                    }}
                                    className="participant-video"
                                    autoPlay
                                    playsInline
                                />
                                {participant.isVideoOff && (
                                    <div className="video-placeholder">
                                        <div className="placeholder-icon">👤</div>
                                    </div>
                                )}
                                <div className="video-overlay">
                                    <span className="participant-name">
                                        {participant.name}
                                        {participant.isMuted && <span className="muted-icon">🔇</span>}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="call-controls">
                <div className="controls-left">
                    <button
                        className={`control-btn ${isMuted ? 'active' : ''}`}
                        onClick={toggleMute}
                        title={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? '🔇' : '🎤'}
                    </button>
                    <button
                        className={`control-btn ${isVideoOff ? 'active' : ''}`}
                        onClick={toggleVideo}
                        title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
                    >
                        {isVideoOff ? '📹' : '📷'}
                    </button>
                    <button
                        className={`control-btn ${isScreenSharing ? 'active' : ''}`}
                        onClick={toggleScreenShare}
                        title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                    >
                        🖥️
                    </button>
                    <button
                        className="control-btn"
                        onClick={toggleFullscreen}
                        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                    >
                        {isFullscreen ? '⊡' : '⛶'}
                    </button>
                </div>

                <div className="controls-center">
                    <button className="control-btn leave-btn" onClick={leaveCall}>
                        📞 Leave Call
                    </button>
                </div>

                <div className="controls-right">
                    <button
                        className={`control-btn ${showParticipants ? 'active' : ''}`}
                        onClick={() => setShowParticipants(!showParticipants)}
                        title="Participants"
                    >
                        👥 {participants.length + 1}
                    </button>
                    <button
                        className={`control-btn ${showChat ? 'active' : ''}`}
                        onClick={() => setShowChat(!showChat)}
                        title="Chat"
                    >
                        💬
                    </button>
                </div>
            </div>

            {/* Chat Sidebar */}
            {showChat && (
                <div className="chat-sidebar">
                    <div className="sidebar-header">
                        <h3>Chat</h3>
                        <button onClick={() => setShowChat(false)}>✕</button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className="chat-message">
                                <div className="message-header">
                                    <span className="message-sender">{msg.sender}</span>
                                    <span className="message-time">{msg.time}</span>
                                </div>
                                <p className="message-text">{msg.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}

            {/* Participants Sidebar */}
            {showParticipants && (
                <div className="participants-sidebar">
                    <div className="sidebar-header">
                        <h3>Participants ({participants.length + 1})</h3>
                        <button onClick={() => setShowParticipants(false)}>✕</button>
                    </div>
                    <div className="participants-list">
                        <div className="participant-item">
                            <div className="participant-avatar">👤</div>
                            <div className="participant-details">
                                <span className="participant-name-text">{currentUser.name} (You)</span>
                                <span className="participant-role">{currentUser.role}</span>
                            </div>
                            <div className="participant-status">
                                {isMuted && <span>🔇</span>}
                                {isVideoOff && <span>📹</span>}
                            </div>
                        </div>
                        {participants.map((participant) => (
                            <div key={participant.id} className="participant-item">
                                <div className="participant-avatar">👤</div>
                                <div className="participant-details">
                                    <span className="participant-name-text">{participant.name}</span>
                                    <span className="participant-role">{participant.role}</span>
                                </div>
                                <div className="participant-status">
                                    {participant.isMuted && <span>🔇</span>}
                                    {participant.isVideoOff && <span>📹</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoCall;
