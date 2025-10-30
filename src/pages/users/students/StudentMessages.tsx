import React, { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { NavigationLink } from '../../../types';
import './StudentMessages.css';

interface Message {
    id: number;
    sender: string;
    senderType: 'student' | 'tutor';
    message: string;
    timestamp: string;
    isMe: boolean;
}

interface ChatRoom {
    id: string;
    name: string;
    module: string;
    lastMessage: string;
    unreadCount: number;
}

const StudentMessages: React.FC = () => {
    const [selectedRoom, setSelectedRoom] = useState<string>('1');
    const [newMessage, setNewMessage] = useState('');

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Live Classes', href: '/student/live-classes' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
        { label: 'Tests', href: '/student/tests' },
        { label: 'Messages', href: '/student/messages' },
    ];

    const chatRooms: ChatRoom[] = [
        {
            id: '1',
            name: 'Mathematics A',
            module: 'Mr. Smith',
            lastMessage: 'Assignment due tomorrow',
            unreadCount: 3,
        },
        {
            id: '2',
            name: 'Physics B',
            module: 'Dr. Wilson',
            lastMessage: 'Great work everyone!',
            unreadCount: 0,
        },
        {
            id: '3',
            name: 'Chemistry C',
            module: 'Dr. Lee',
            lastMessage: 'Lab session rescheduled',
            unreadCount: 1,
        },
    ];

    const messages: { [key: string]: Message[] } = {
        '1': [
            {
                id: 1,
                sender: 'Mr. Smith',
                senderType: 'tutor',
                message: 'Good morning everyone! Today we\'ll be covering calculus integration.',
                timestamp: '09:00',
                isMe: false,
            },
            {
                id: 2,
                sender: 'You',
                senderType: 'student',
                message: 'Good morning Mr. Smith!',
                timestamp: '09:02',
                isMe: true,
            },
            {
                id: 3,
                sender: 'Jane Smith',
                senderType: 'student',
                message: 'I have a question about yesterday\'s homework.',
                timestamp: '09:05',
                isMe: false,
            },
            {
                id: 4,
                sender: 'Mr. Smith',
                senderType: 'tutor',
                message: 'Sure Jane, what\'s your question?',
                timestamp: '09:06',
                isMe: false,
            },
            {
                id: 5,
                sender: 'Jane Smith',
                senderType: 'student',
                message: 'I\'m confused about problem 5 on page 42.',
                timestamp: '09:07',
                isMe: false,
            },
            {
                id: 6,
                sender: 'Mr. Smith',
                senderType: 'tutor',
                message: 'Don\'t forget - assignment due tomorrow at 5 PM!',
                timestamp: '10:30',
                isMe: false,
            },
        ],
        '2': [
            {
                id: 1,
                sender: 'Dr. Wilson',
                senderType: 'tutor',
                message: 'Great work on the quantum mechanics test everyone!',
                timestamp: '14:00',
                isMe: false,
            },
        ],
        '3': [
            {
                id: 1,
                sender: 'Dr. Lee',
                senderType: 'tutor',
                message: 'Lab session has been rescheduled to Friday 2 PM.',
                timestamp: '11:00',
                isMe: false,
            },
        ],
    };

    const currentRoom = chatRooms.find(room => room.id === selectedRoom);
    const currentMessages = messages[selectedRoom] || [];

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            alert(`Message sent: ${newMessage}`);
            setNewMessage('');
            // In a real app, this would add the message to the chat
        }
    };

    return (
        <div className="student-messages-page">
            <Header navigationLinks={navigationLinks} />

            <div className="messages-container">
                <div className="messages-layout">
                    {/* Chat Rooms List */}
                    <div className="chat-rooms-list">
                        <div className="chat-rooms-header">
                            <h2>Group Chats</h2>
                        </div>
                        {chatRooms.map(room => (
                            <div
                                key={room.id}
                                className={`chat-room-item ${selectedRoom === room.id ? 'active' : ''}`}
                                onClick={() => setSelectedRoom(room.id)}
                            >
                                <div className="room-icon">📚</div>
                                <div className="room-info">
                                    <h3>{room.name}</h3>
                                    <p className="room-tutor">👨‍🏫 {room.module}</p>
                                    <p className="room-last-message">{room.lastMessage}</p>
                                </div>
                                {room.unreadCount > 0 && (
                                    <div className="unread-badge">{room.unreadCount}</div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Chat Area */}
                    <div className="chat-area">
                        {currentRoom ? (
                            <>
                                <div className="chat-header">
                                    <div className="chat-header-info">
                                        <h2>{currentRoom.name}</h2>
                                        <p>👨‍🏫 {currentRoom.module}</p>
                                    </div>
                                    <button className="btn btn-outline">📞 Join Live Class</button>
                                </div>

                                <div className="messages-area">
                                    {currentMessages.map(msg => (
                                        <div
                                            key={msg.id}
                                            className={`message ${msg.isMe ? 'message-me' : 'message-other'} ${msg.senderType === 'tutor' ? 'message-tutor' : ''}`}
                                        >
                                            <div className="message-content">
                                                <div className="message-sender">
                                                    {msg.senderType === 'tutor' ? '👨‍🏫' : '👤'} {msg.sender}
                                                </div>
                                                <div className="message-text">{msg.message}</div>
                                                <div className="message-timestamp">{msg.timestamp}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <form className="message-input-area" onSubmit={handleSendMessage}>
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button type="submit" className="btn btn-primary">Send</button>
                                </form>
                            </>
                        ) : (
                            <div className="no-chat-selected">
                                <span className="empty-icon">💬</span>
                                <h3>Select a group chat</h3>
                                <p>Choose a class to view messages</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default StudentMessages;
