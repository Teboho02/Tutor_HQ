import React, { useState } from 'react';
import './TutorMessages.css';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

interface Message {
    id: number;
    sender: string;
    senderType: 'tutor' | 'student' | 'parent';
    message: string;
    timestamp: string;
    isMe: boolean;
}

interface ChatRoom {
    id: string;
    name: string;
    module: string;
    studentCount: number;
    lastMessage: string;
    unreadCount: number;
}

interface ParentChat {
    id: string;
    parentName: string;
    studentName: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
}

const TutorMessages: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'groups' | 'parents'>('groups');
    const [selectedGroupRoom, setSelectedGroupRoom] = useState<string | null>('1');
    const [selectedParentChat, setSelectedParentChat] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');

    // Mock data for group chat rooms
    const groupRooms: ChatRoom[] = [
        {
            id: '1',
            name: 'Mathematics A',
            module: 'Module A',
            studentCount: 15,
            lastMessage: 'Assignment due tomorrow at 5 PM!',
            unreadCount: 0
        },
        {
            id: '2',
            name: 'Physics B',
            module: 'Module B',
            studentCount: 12,
            lastMessage: 'Thank you for the explanation!',
            unreadCount: 2
        },
        {
            id: '3',
            name: 'Chemistry C',
            module: 'Module C',
            studentCount: 18,
            lastMessage: 'Can we schedule a review session?',
            unreadCount: 5
        },
        {
            id: '4',
            name: 'Biology D',
            module: 'Module D',
            studentCount: 14,
            lastMessage: 'Lab report submitted',
            unreadCount: 0
        },
        {
            id: '5',
            name: 'English E',
            module: 'Module E',
            studentCount: 20,
            lastMessage: 'Essay feedback received',
            unreadCount: 1
        }
    ];

    // Mock data for parent chats
    const parentChats: ParentChat[] = [
        {
            id: 'p1',
            parentName: 'Sarah Johnson',
            studentName: 'Emma Johnson',
            lastMessage: "I'd like to discuss Emma's progress in Math",
            timestamp: '2 hours ago',
            unreadCount: 1
        },
        {
            id: 'p2',
            parentName: 'Michael Chen',
            studentName: 'David Chen',
            lastMessage: 'Thank you for the additional resources!',
            timestamp: '1 day ago',
            unreadCount: 0
        },
        {
            id: 'p3',
            parentName: 'Lisa Williams',
            studentName: 'Sophie Williams',
            lastMessage: 'When is the next parent-teacher meeting?',
            timestamp: '2 days ago',
            unreadCount: 3
        },
        {
            id: 'p4',
            parentName: 'James Brown',
            studentName: 'Oliver Brown',
            lastMessage: 'Oliver mentioned he needs extra help',
            timestamp: '3 days ago',
            unreadCount: 0
        }
    ];

    // Mock messages for group chats
    const groupMessages: { [key: string]: Message[] } = {
        '1': [
            {
                id: 1,
                sender: 'You',
                senderType: 'tutor',
                message: 'Good morning everyone! Today we\'ll be covering calculus integration.',
                timestamp: '09:00',
                isMe: true
            },
            {
                id: 2,
                sender: 'Emma Johnson',
                senderType: 'student',
                message: 'Good morning Mr. Smith!',
                timestamp: '09:02',
                isMe: false
            },
            {
                id: 3,
                sender: 'Jane Smith',
                senderType: 'student',
                message: 'I have a question about yesterday\'s homework.',
                timestamp: '09:05',
                isMe: false
            },
            {
                id: 4,
                sender: 'You',
                senderType: 'tutor',
                message: 'Sure Jane, what\'s your question?',
                timestamp: '09:06',
                isMe: true
            },
            {
                id: 5,
                sender: 'Jane Smith',
                senderType: 'student',
                message: 'I\'m confused about problem 5 on page 42.',
                timestamp: '09:07',
                isMe: false
            },
            {
                id: 6,
                sender: 'You',
                senderType: 'tutor',
                message: 'Don\'t forget - assignment due tomorrow at 5 PM!',
                timestamp: '10:30',
                isMe: true
            }
        ],
        '2': [
            {
                id: 1,
                sender: 'You',
                senderType: 'tutor',
                message: 'Reminder: Lab report due this Friday.',
                timestamp: '14:00',
                isMe: true
            },
            {
                id: 2,
                sender: 'David Chen',
                senderType: 'student',
                message: 'Thank you for the explanation!',
                timestamp: '14:30',
                isMe: false
            }
        ]
    };

    // Mock messages for parent chats
    const parentMessages: { [key: string]: Message[] } = {
        'p1': [
            {
                id: 1,
                sender: 'Sarah Johnson',
                senderType: 'parent',
                message: 'Hello Mr. Smith, I wanted to check in about Emma\'s recent test scores.',
                timestamp: '10:00',
                isMe: false
            },
            {
                id: 2,
                sender: 'You',
                senderType: 'tutor',
                message: 'Hello Mrs. Johnson! Emma is doing well overall. She scored 85% on the last test.',
                timestamp: '10:15',
                isMe: true
            },
            {
                id: 3,
                sender: 'Sarah Johnson',
                senderType: 'parent',
                message: 'That\'s great to hear! Are there any areas she needs to focus on?',
                timestamp: '10:20',
                isMe: false
            },
            {
                id: 4,
                sender: 'You',
                senderType: 'tutor',
                message: 'She could benefit from more practice with word problems. I can send some additional exercises.',
                timestamp: '10:25',
                isMe: true
            },
            {
                id: 5,
                sender: 'Sarah Johnson',
                senderType: 'parent',
                message: 'I\'d like to discuss Emma\'s progress in Math',
                timestamp: '11:00',
                isMe: false
            }
        ],
        'p2': [
            {
                id: 1,
                sender: 'Michael Chen',
                senderType: 'parent',
                message: 'Hi, David mentioned you shared some great resources for physics.',
                timestamp: '15:00',
                isMe: false
            },
            {
                id: 2,
                sender: 'You',
                senderType: 'tutor',
                message: 'Yes! I\'ve uploaded some interactive simulations to the materials section.',
                timestamp: '15:30',
                isMe: true
            },
            {
                id: 3,
                sender: 'Michael Chen',
                senderType: 'parent',
                message: 'Thank you for the additional resources!',
                timestamp: '16:00',
                isMe: false
            }
        ]
    };

    const tutorNavigation = [
        { label: 'Dashboard', href: '/tutor/dashboard' },
        { label: 'Classes', href: '/tutor/classes' },
        { label: 'Schedule', href: '/tutor/schedule' },
        { label: 'Students', href: '/tutor/students' },
        { label: 'Materials', href: '/tutor/materials' },
        { label: 'Messages', href: '/tutor/messages' },
        { label: 'Account', href: '/tutor/account' }
    ];

    const handleSendGroupMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            alert(`Message sent to group chat: "${newMessage}"`);
            setNewMessage('');
        }
    };

    const handleSendParentMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            alert(`Message sent to parent: "${newMessage}"`);
            setNewMessage('');
        }
    };

    const handleBroadcastMessage = () => {
        const message = prompt('Enter announcement to send to all students:');
        if (message) {
            alert(`Announcement sent to all students in this class: "${message}"`);
        }
    };

    const currentGroupRoom = groupRooms.find(room => room.id === selectedGroupRoom);
    const currentParentChat = parentChats.find(chat => chat.id === selectedParentChat);

    return (
        <div className="tutor-messages-page">
            <Header navigationLinks={tutorNavigation} />

            <div className="messages-container">
                <div className="messages-tabs">
                    <button
                        className={`tab-button ${activeTab === 'groups' ? 'active' : ''}`}
                        onClick={() => setActiveTab('groups')}
                    >
                        📚 Group Chats
                        {groupRooms.reduce((sum, room) => sum + room.unreadCount, 0) > 0 && (
                            <span className="tab-badge">
                                {groupRooms.reduce((sum, room) => sum + room.unreadCount, 0)}
                            </span>
                        )}
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'parents' ? 'active' : ''}`}
                        onClick={() => setActiveTab('parents')}
                    >
                        👨‍👩‍👧‍👦 Parent Messages
                        {parentChats.reduce((sum, chat) => sum + chat.unreadCount, 0) > 0 && (
                            <span className="tab-badge">
                                {parentChats.reduce((sum, chat) => sum + chat.unreadCount, 0)}
                            </span>
                        )}
                    </button>
                </div>

                <div className="messages-layout">
                    {/* Group Chats Tab */}
                    {activeTab === 'groups' && (
                        <>
                            <div className="chat-rooms-list">
                                <div className="chat-rooms-header">
                                    <h2>Your Classes</h2>
                                    <p>{groupRooms.length} active classes</p>
                                </div>
                                {groupRooms.map((room) => (
                                    <div
                                        key={room.id}
                                        className={`chat-room-item ${selectedGroupRoom === room.id ? 'active' : ''}`}
                                        onClick={() => setSelectedGroupRoom(room.id)}
                                    >
                                        <div className="room-icon">📚</div>
                                        <div className="room-info">
                                            <h3>{room.name}</h3>
                                            <p className="room-students">👥 {room.studentCount} students</p>
                                            <p className="room-last-message">{room.lastMessage}</p>
                                        </div>
                                        {room.unreadCount > 0 && (
                                            <span className="unread-badge">{room.unreadCount}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="chat-area">
                                {selectedGroupRoom ? (
                                    <>
                                        <div className="chat-header">
                                            <div className="chat-header-info">
                                                <h2>{currentGroupRoom?.name}</h2>
                                                <p>👥 {currentGroupRoom?.studentCount} students • {currentGroupRoom?.module}</p>
                                            </div>
                                            <div className="chat-header-actions">
                                                <button className="btn btn-outline" onClick={handleBroadcastMessage}>
                                                    📢 Broadcast Announcement
                                                </button>
                                                <button className="btn btn-primary">
                                                    🎥 Start Live Class
                                                </button>
                                            </div>
                                        </div>

                                        <div className="messages-area">
                                            {groupMessages[selectedGroupRoom]?.map((message) => (
                                                <div
                                                    key={message.id}
                                                    className={`message ${message.isMe ? 'message-me' : 'message-other'} ${message.senderType === 'tutor' && !message.isMe ? 'message-tutor' : ''}`}
                                                >
                                                    <div className="message-content">
                                                        <div className="message-sender">
                                                            {message.senderType === 'student' ? '👤' : '👨‍🏫'} {message.sender}
                                                        </div>
                                                        <div className="message-text">{message.message}</div>
                                                        <div className="message-timestamp">{message.timestamp}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <form className="message-input-area" onSubmit={handleSendGroupMessage}>
                                            <input
                                                type="text"
                                                placeholder="Type a message..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                            />
                                            <button type="submit" className="btn btn-primary">
                                                Send
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <div className="no-chat-selected">
                                        <div className="empty-icon">💬</div>
                                        <h3>Select a class to view messages</h3>
                                        <p>Choose a class from the list to start communicating with your students</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Parent Messages Tab */}
                    {activeTab === 'parents' && (
                        <>
                            <div className="chat-rooms-list">
                                <div className="chat-rooms-header">
                                    <h2>Parent Conversations</h2>
                                    <p>{parentChats.length} conversations</p>
                                </div>
                                {parentChats.map((chat) => (
                                    <div
                                        key={chat.id}
                                        className={`chat-room-item ${selectedParentChat === chat.id ? 'active' : ''}`}
                                        onClick={() => setSelectedParentChat(chat.id)}
                                    >
                                        <div className="room-icon parent-icon">👤</div>
                                        <div className="room-info">
                                            <h3>{chat.parentName}</h3>
                                            <p className="room-students">Student: {chat.studentName}</p>
                                            <p className="room-last-message">{chat.lastMessage}</p>
                                            <p className="room-timestamp">{chat.timestamp}</p>
                                        </div>
                                        {chat.unreadCount > 0 && (
                                            <span className="unread-badge">{chat.unreadCount}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="chat-area">
                                {selectedParentChat ? (
                                    <>
                                        <div className="chat-header">
                                            <div className="chat-header-info">
                                                <h2>{currentParentChat?.parentName}</h2>
                                                <p>Parent of {currentParentChat?.studentName}</p>
                                            </div>
                                            <button className="btn btn-outline">
                                                📅 Schedule Meeting
                                            </button>
                                        </div>

                                        <div className="messages-area">
                                            {parentMessages[selectedParentChat]?.map((message) => (
                                                <div
                                                    key={message.id}
                                                    className={`message ${message.isMe ? 'message-me' : 'message-other'}`}
                                                >
                                                    <div className="message-content">
                                                        <div className="message-sender">
                                                            {message.senderType === 'parent' ? '👤' : '👨‍🏫'} {message.sender}
                                                        </div>
                                                        <div className="message-text">{message.message}</div>
                                                        <div className="message-timestamp">{message.timestamp}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <form className="message-input-area" onSubmit={handleSendParentMessage}>
                                            <input
                                                type="text"
                                                placeholder="Type a message..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                            />
                                            <button type="submit" className="btn btn-primary">
                                                Send
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <div className="no-chat-selected">
                                        <div className="empty-icon">👨‍👩‍👧‍👦</div>
                                        <h3>Select a conversation to view messages</h3>
                                        <p>Choose a parent from the list to start or continue a conversation</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TutorMessages;
