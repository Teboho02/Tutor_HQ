import React, { useState } from 'react';
import type { SchoolTest } from '../types/schoolTest';
import '../styles/SchoolTestCard.css';

interface SchoolTestCardProps {
    test: SchoolTest;
    onAddComment?: (testId: string, comment: string, isPrivate: boolean) => void;
    isTutorView?: boolean;
}

export const SchoolTestCard: React.FC<SchoolTestCardProps> = ({ test, onAddComment, isTutorView = false }) => {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'reviewed':
                return '#4CAF50';
            case 'needs_improvement':
                return '#ff9800';
            default:
                return '#2196F3';
        }
    };

    const getStatusLabel = (status: string): string => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const handleSubmitComment = () => {
        if (newComment.trim() && onAddComment) {
            onAddComment(test.id, newComment.trim(), isPrivate);
            setNewComment('');
            setIsPrivate(false);
        }
    };

    const getPercentage = (): number | null => {
        if (test.score !== undefined && test.maxScore !== undefined && test.maxScore > 0) {
            return Math.round((test.score / test.maxScore) * 100);
        }
        return null;
    };

    const percentage = getPercentage();

    return (
        <>
            <div className="school-test-card">
                <div className="test-header">
                    <div className="test-info">
                        <h3 className="test-name">{test.testName}</h3>
                        <p className="test-subject">{test.subject}</p>
                    </div>
                    <div className="test-status" style={{ background: getStatusColor(test.status) }}>
                        {getStatusLabel(test.status)}
                    </div>
                </div>

                <div className="test-image-container" onClick={() => setShowImageModal(true)}>
                    <img src={test.thumbnailUrl || test.imageUrl} alt={test.testName} className="test-image" />
                    <div className="image-overlay">
                        <span>👁️ View Full Image</span>
                    </div>
                </div>

                <div className="test-details">
                    <div className="detail-row">
                        <span className="detail-label">Test Date:</span>
                        <span className="detail-value">{formatDate(test.testDate)}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Uploaded:</span>
                        <span className="detail-value">{formatDate(test.uploadedAt)}</span>
                    </div>
                    {test.score !== undefined && test.maxScore !== undefined && (
                        <div className="detail-row">
                            <span className="detail-label">Score:</span>
                            <span className="detail-value score">
                                {test.score}/{test.maxScore}
                                {percentage !== null && <span className="percentage"> ({percentage}%)</span>}
                            </span>
                        </div>
                    )}
                    {test.grade && (
                        <div className="detail-row">
                            <span className="detail-label">Grade:</span>
                            <span className="detail-value grade">{test.grade}</span>
                        </div>
                    )}
                </div>

                {test.tags.length > 0 && (
                    <div className="test-tags">
                        {test.tags.map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                        ))}
                    </div>
                )}

                <div className="test-actions">
                    <button
                        className="comments-btn"
                        onClick={() => setShowComments(!showComments)}
                    >
                        💬 Comments ({test.tutorComments.length})
                    </button>
                </div>

                {showComments && (
                    <div className="comments-section">
                        <div className="comments-list">
                            {test.tutorComments.length === 0 ? (
                                <p className="no-comments">No comments yet</p>
                            ) : (
                                test.tutorComments.map(comment => (
                                    <div key={comment.id} className="comment">
                                        <div className="comment-header">
                                            <span className="comment-author">{comment.tutorName}</span>
                                            <span className="comment-date">{formatDate(comment.createdAt)}</span>
                                        </div>
                                        <p className="comment-text">{comment.comment}</p>
                                        {comment.isPrivate && (
                                            <span className="private-badge">🔒 Private</span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {isTutorView && onAddComment && (
                            <div className="add-comment">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    rows={3}
                                    className="comment-input"
                                />
                                <div className="comment-actions">
                                    <label className="private-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={isPrivate}
                                            onChange={(e) => setIsPrivate(e.target.checked)}
                                        />
                                        Private (only student can see)
                                    </label>
                                    <button
                                        onClick={handleSubmitComment}
                                        className="submit-comment-btn"
                                        disabled={!newComment.trim()}
                                    >
                                        Post Comment
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showImageModal && (
                <div className="image-modal" onClick={() => setShowImageModal(false)}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowImageModal(false)}>✕</button>
                        <img src={test.imageUrl} alt={test.testName} className="full-image" />
                    </div>
                </div>
            )}
        </>
    );
};
