import React, { useState, useRef } from 'react';
import type { Question, QuestionType, AnswerOption } from '../types/test';
import { testService } from '../services/test.service';
import './TestBuilder.css';

interface TestBuilderProps {
    onQuestionsChange: (questions: Question[]) => void;
    initialQuestions?: Question[];
}

const TestBuilder: React.FC<TestBuilderProps> = ({ onQuestionsChange, initialQuestions = [] }) => {
    const [questions, setQuestions] = useState<Question[]>(initialQuestions);
    const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
    const [uploadingQuestions, setUploadingQuestions] = useState<Set<string>>(new Set());
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const addQuestion = () => {
        const newQuestion: Question = {
            id: `q-${Date.now()}`,
            type: 'text',
            content: { text: '' },
            points: 1,
        };
        const updated = [...questions, newQuestion];
        setQuestions(updated);
        onQuestionsChange(updated);
        setExpandedQuestion(newQuestion.id);
    };

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        const updated = questions.map(q => q.id === id ? { ...q, ...updates } : q);
        setQuestions(updated);
        onQuestionsChange(updated);
    };

    const deleteQuestion = (id: string) => {
        const updated = questions.filter(q => q.id !== id);
        setQuestions(updated);
        onQuestionsChange(updated);
    };

    const addOption = (questionId: string) => {
        const question = questions.find(q => q.id === questionId);
        if (!question) return;

        const newOption: AnswerOption = {
            id: `opt-${Date.now()}`,
            text: '',
            isCorrect: false,
        };

        updateQuestion(questionId, {
            options: [...(question.options || []), newOption],
        });
    };

    const updateOption = (questionId: string, optionId: string, updates: Partial<AnswerOption>) => {
        const question = questions.find(q => q.id === questionId);
        if (!question || !question.options) return;

        const updatedOptions = question.options.map((opt: AnswerOption) =>
            opt.id === optionId ? { ...opt, ...updates } : opt
        );

        updateQuestion(questionId, { options: updatedOptions });
    };

    const deleteOption = (questionId: string, optionId: string) => {
        const question = questions.find(q => q.id === questionId);
        if (!question || !question.options) return;

        updateQuestion(questionId, {
            options: question.options.filter((opt: AnswerOption) => opt.id !== optionId),
        });
    };

    const handleImageUpload = async (questionId: string, file: File) => {
        // Validate file client-side
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be less than 5MB');
            return;
        }

        setUploadingQuestions(prev => new Set(prev).add(questionId));

        try {
            const { imageUrl } = await testService.uploadQuestionImage(file);
            updateQuestion(questionId, {
                content: { ...questions.find(q => q.id === questionId)!.content, image: imageUrl }
            });
        } catch (error) {
            console.error('Failed to upload image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingQuestions(prev => {
                const next = new Set(prev);
                next.delete(questionId);
                return next;
            });
        }
    };

    const handleRemoveImage = async (questionId: string) => {
        const question = questions.find(q => q.id === questionId);
        if (!question?.content.image) return;

        try {
            // Extract file name from Supabase URL
            const url = question.content.image;
            const match = url.match(/test-assets\/(.+)$/);
            if (match) {
                await testService.deleteQuestionImage(match[1]);
            }
        } catch (error) {
            console.error('Failed to delete image from storage:', error);
        }

        // Remove from question regardless of storage deletion result
        updateQuestion(questionId, {
            content: { ...question.content, image: undefined }
        });

        // Reset file input
        const fileInput = fileInputRefs.current[questionId];
        if (fileInput) fileInput.value = '';
    };

    const getQuestionTypeIcon = (type: QuestionType) => {
        switch (type) {
            case 'text': return '📝';
            case 'multiple-choice': return '⭕';
            case 'multiple-select': return '☑️';
            case 'scale': return '📊';
            case 'image': return '🖼️';
        }
    };

    const getTotalPoints = () => {
        return questions.reduce((sum, q) => sum + q.points, 0);
    };

    return (
        <div className="test-builder">
            <div className="builder-header">
                <h3>📋 Test Questions</h3>
                <div className="builder-stats">
                    <span className="stat">{questions.length} Questions</span>
                    <span className="stat">{getTotalPoints()} Total Points</span>
                </div>
            </div>

            <div className="questions-list">
                {questions.map((question, index) => (
                    <div
                        key={question.id}
                        className={`question-card ${expandedQuestion === question.id ? 'expanded' : ''}`}
                    >
                        <div className="question-header" onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}>
                            <div className="question-title">
                                <span className="question-number">Q{index + 1}</span>
                                <span className="question-type-icon">{getQuestionTypeIcon(question.type)}</span>
                                <span className="question-preview">
                                    {question.content.text || 'Untitled Question'}
                                </span>
                            </div>
                            <div className="question-actions">
                                <span className="points-badge">{question.points} pts</span>
                                <button
                                    type="button"
                                    className="btn-icon"
                                    onClick={(e) => { e.stopPropagation(); deleteQuestion(question.id); }}
                                    title="Delete Question"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>

                        {expandedQuestion === question.id && (
                            <div className="question-body">
                                {/* Question Type Selector */}
                                <div className="form-group">
                                    <label>Question Type</label>
                                    <select
                                        value={question.type}
                                        onChange={(e) => updateQuestion(question.id, { type: e.target.value as QuestionType })}
                                        className="form-control"
                                    >
                                        <option value="text">Text Answer</option>
                                        <option value="multiple-choice">Multiple Choice (Single)</option>
                                        <option value="multiple-select">Multiple Select</option>
                                        <option value="scale">Scale (1-10)</option>
                                        <option value="image">Image Options</option>
                                    </select>
                                </div>

                                {/* Question Content */}
                                <div className="form-group">
                                    <label>Question Text</label>
                                    <textarea
                                        value={question.content.text || ''}
                                        onChange={(e) => updateQuestion(question.id, {
                                            content: { ...question.content, text: e.target.value }
                                        })}
                                        className="form-control"
                                        rows={3}
                                        placeholder="Enter your question here..."
                                    />
                                </div>

                                {/* Question Image Upload (Optional) */}
                                <div className="form-group">
                                    <label>Question Image (Optional)</label>
                                    {!question.content.image && !uploadingQuestions.has(question.id) && (
                                        <div
                                            className="image-upload-zone"
                                            onClick={() => fileInputRefs.current[question.id]?.click()}
                                            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
                                            onDragLeave={(e) => { e.currentTarget.classList.remove('drag-over'); }}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                e.currentTarget.classList.remove('drag-over');
                                                const file = e.dataTransfer.files[0];
                                                if (file) handleImageUpload(question.id, file);
                                            }}
                                        >
                                            <span className="upload-icon">📷</span>
                                            <span className="upload-text">Click or drag an image here</span>
                                            <span className="upload-hint">JPEG, PNG, GIF, WebP — Max 5MB</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        ref={(el) => { fileInputRefs.current[question.id] = el; }}
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImageUpload(question.id, file);
                                        }}
                                    />
                                    {uploadingQuestions.has(question.id) && (
                                        <div className="image-uploading">
                                            <div className="uploading-spinner"></div>
                                            <span>Uploading image...</span>
                                        </div>
                                    )}
                                    {question.content.image && !uploadingQuestions.has(question.id) && (
                                        <div className="image-preview-wrapper">
                                            <img src={question.content.image} alt="Question" className="question-image-preview" />
                                            <button
                                                type="button"
                                                className="image-remove-btn"
                                                onClick={() => handleRemoveImage(question.id)}
                                                title="Remove image"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Text Answer Type */}
                                {question.type === 'text' && (
                                    <div className="form-group">
                                        <label>Correct Answer (for grading reference)</label>
                                        <input
                                            type="text"
                                            value={question.correctAnswer as string || ''}
                                            onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                                            className="form-control"
                                            placeholder="Expected answer..."
                                        />
                                        <small className="form-hint">This is used for auto-grading. Students won't see this.</small>
                                    </div>
                                )}

                                {/* Multiple Choice / Multiple Select */}
                                {(question.type === 'multiple-choice' || question.type === 'multiple-select') && (
                                    <div className="form-group">
                                        <label>Answer Options</label>
                                        <div className="options-list">
                                            {question.options?.map((option: AnswerOption, optIndex: number) => (
                                                <div key={option.id} className="option-item">
                                                    <input
                                                        type={question.type === 'multiple-choice' ? 'radio' : 'checkbox'}
                                                        checked={option.isCorrect}
                                                        onChange={(e) => updateOption(question.id, option.id, { isCorrect: e.target.checked })}
                                                        className="option-checkbox"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={option.text || ''}
                                                        onChange={(e) => updateOption(question.id, option.id, { text: e.target.value })}
                                                        className="form-control option-input"
                                                        placeholder={`Option ${optIndex + 1}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-icon"
                                                        onClick={() => deleteOption(question.id, option.id)}
                                                        title="Delete Option"
                                                    >
                                                        ❌
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-outline btn-sm"
                                            onClick={() => addOption(question.id)}
                                        >
                                            + Add Option
                                        </button>
                                        <small className="form-hint">
                                            {question.type === 'multiple-choice'
                                                ? 'Select one correct answer'
                                                : 'Select all correct answers'}
                                        </small>
                                    </div>
                                )}

                                {/* Scale Type */}
                                {question.type === 'scale' && (
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Scale Min</label>
                                            <input
                                                type="number"
                                                value={question.scaleMin || 1}
                                                onChange={(e) => updateQuestion(question.id, { scaleMin: parseInt(e.target.value) })}
                                                className="form-control"
                                                min="1"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Scale Max</label>
                                            <input
                                                type="number"
                                                value={question.scaleMax || 10}
                                                onChange={(e) => updateQuestion(question.id, { scaleMax: parseInt(e.target.value) })}
                                                className="form-control"
                                                max="20"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Correct Answer</label>
                                            <input
                                                type="number"
                                                value={question.correctScale || 5}
                                                onChange={(e) => updateQuestion(question.id, { correctScale: parseInt(e.target.value) })}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Points */}
                                <div className="form-group">
                                    <label>Points</label>
                                    <input
                                        type="number"
                                        value={question.points}
                                        onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                                        className="form-control"
                                        min="1"
                                        style={{ width: '100px' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button type="button" className="btn btn-primary btn-add-question" onClick={addQuestion}>
                ➕ Add Question
            </button>
        </div>
    );
};

export default TestBuilder;
