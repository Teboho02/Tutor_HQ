import React, { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { NavigationLink } from '../../../types';
import './ParentMessages.css';

interface Message {
    id: number;
    sender: string;
    senderType: 'tutor' | 'admin';
    subject: string;
    preview: string;
    timestamp: string;
    read: boolean;
    childName?: string;
}

const ParentMessages: React.FC = () => {
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/parent/dashboard' },
        { label: 'Messages', href: '/parent/messages' },
        { label: 'Payments', href: '/parent/payments' },
        { label: 'Schedule', href: '/parent/schedule' },
        { label: 'My Account', href: '/parent/account' },
    ];

    const messages: Message[] = [
        {
            id: 1,
            sender: 'Mr. Smith',
            senderType: 'tutor',
            subject: 'Emma\'s Progress Update',
            preview: 'I wanted to share some excellent news about Emma\'s progress in Mathematics...',
            timestamp: '2 hours ago',
            read: false,
            childName: 'Emma Johnson',
        },
        {
            id: 2,
            sender: 'Dr. Wilson',
            senderType: 'tutor',
            subject: 'James - Upcoming Test',
            preview: 'This is to inform you about the upcoming Physics test scheduled for next week...',
            timestamp: '5 hours ago',
            read: false,
            childName: 'James Johnson',
        },
        {
            id: 3,
            sender: 'Admin Office',
            senderType: 'admin',
            subject: 'School Holiday Notification',
            preview: 'Please note that the school will be closed on Friday, November 3rd...',
            timestamp: '1 day ago',
            read: true,
        },
        {
            id: 4,
            sender: 'Ms. Davis',
            senderType: 'tutor',
            subject: 'Sophie\'s Assignment Submission',
            preview: 'Sophie has been doing great with her English assignments. Her latest essay...',
            timestamp: '2 days ago',
            read: true,
            childName: 'Sophie Johnson',
        },
        {
            id: 5,
            sender: 'Mr. Brown',
            senderType: 'tutor',
            subject: 'Emma - Chemistry Lab Session',
            preview: 'We have scheduled an additional Chemistry lab session for Emma and her classmates...',
            timestamp: '3 days ago',
            read: true,
            childName: 'Emma Johnson',
        },
    ];

    return (
        <div className="parent-messages-page">
            <Header navigationLinks={navigationLinks} />

            <div className="messages-container">
                <div className="page-header">
                    <h1>Messages</h1>
                    <button className="btn btn-primary">+ Compose</button>
                </div>

                <div className="messages-layout">
                    {/* Messages List */}
                    <div className="messages-list">
                        {messages.map(message => (
                            <div
                                key={message.id}
                                className={`message-item ${!message.read ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'active' : ''}`}
                                onClick={() => setSelectedMessage(message)}
                            >
                                <div className="message-header">
                                    <div className="sender-info">
                                        <div className={`sender-avatar ${message.senderType}`}>
                                            {message.senderType === 'tutor' ? '👨‍🏫' : '🏫'}
                                        </div>
                                        <div>
                                            <h3>{message.sender}</h3>
                                            {message.childName && (
                                                <span className="child-tag">Re: {message.childName}</span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="timestamp">{message.timestamp}</span>
                                </div>
                                <h4 className="message-subject">{message.subject}</h4>
                                <p className="message-preview">{message.preview}</p>
                                {!message.read && <div className="unread-indicator" />}
                            </div>
                        ))}
                    </div>

                    {/* Message Detail */}
                    <div className="message-detail">
                        {selectedMessage ? (
                            <>
                                <div className="detail-header">
                                    <div className="detail-sender">
                                        <div className={`sender-avatar-large ${selectedMessage.senderType}`}>
                                            {selectedMessage.senderType === 'tutor' ? '👨‍🏫' : '🏫'}
                                        </div>
                                        <div>
                                            <h2>{selectedMessage.subject}</h2>
                                            <p>From: {selectedMessage.sender}</p>
                                            {selectedMessage.childName && (
                                                <span className="child-tag">Regarding: {selectedMessage.childName}</span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="detail-timestamp">{selectedMessage.timestamp}</span>
                                </div>

                                <div className="detail-content">
                                    <p>
                                        {selectedMessage.preview}
                                    </p>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                    <p>
                                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </p>
                                    <p>Best regards,<br />{selectedMessage.sender}</p>
                                </div>

                                <div className="detail-actions">
                                    <button className="btn btn-primary">Reply</button>
                                    <button className="btn btn-outline">Forward</button>
                                    <button className="btn btn-outline">Archive</button>
                                </div>
                            </>
                        ) : (
                            <div className="no-message-selected">
                                <div className="empty-state">
                                    <span className="empty-icon">📧</span>
                                    <h3>No message selected</h3>
                                    <p>Select a message from the list to view its content</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ParentMessages;
