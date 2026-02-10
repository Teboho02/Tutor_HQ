import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Toast from '../../../components/Toast';
import { testService } from '../../../services/test.service';
import type { NavigationLink } from '../../../types';
import type { Test, StudentAnswer } from '../../../types/test';
import './TakeTest.css';

const TakeTest: React.FC = () => {
    const { testId } = useParams<{ testId: string }>();
    const navigate = useNavigate();
    const [test, setTest] = useState<Test | null>(null);
    const [answers, setAnswers] = useState<StudentAnswer[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
    };

    const hideToast = () => setToast(null);

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
        { label: 'Tests', href: '/student/tests' },
        { label: 'Goals', href: '/student/goals' },
    ];

    // Fetch test data from backend
    useEffect(() => {
        const fetchTest = async () => {
            if (!testId) {
                showToast('Invalid test ID', 'error');
                navigate('/student/tests');
                return;
            }

            try {
                setLoading(true);
                const response = await testService.getTest(testId);

                if (response.success && response.data.test) {
                    const testData = response.data.test;
                    const transformedTest: Test = {
                        id: testData.id,
                        title: testData.title,
                        subject: testData.classes?.subject || 'General',
                        description: testData.description,
                        tutorId: testData.tutor_id,
                        tutorName: 'Teacher',
                        scheduledDate: testData.scheduled_at,
                        scheduledTime: new Date(testData.scheduled_at).toLocaleTimeString(),
                        duration: Math.floor((new Date(testData.due_date).getTime() - new Date(testData.scheduled_at).getTime()) / 60000) || 90,
                        totalPoints: testData.total_marks,
                        studentIds: [],
                        status: 'active',
                        createdAt: testData.created_at,
                        questions: testData.questions || [],
                    };

                    setTest(transformedTest);
                    setTimeRemaining(transformedTest.duration * 60);

                    // Initialize answers array
                    const initialAnswers: StudentAnswer[] = transformedTest.questions.map(q => ({
                        questionId: q.id,
                        answer: q.type === 'multiple-select' ? [] : '',
                    }));
                    setAnswers(initialAnswers);
                }
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } } };
                showToast(err.response?.data?.message || 'Failed to load test', 'error');
                setTimeout(() => navigate('/student/tests'), 2000);
            } finally {
                setLoading(false);
            }
        };

        fetchTest();
    }, [testId, navigate]);


    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (questionId: string, answer: string | string[] | number) => {
        setAnswers(prev =>
            prev.map(a => (a.questionId === questionId ? { ...a, answer } : a))
        );
    };

    const handleSubmit = useCallback(async () => {
        if (isSubmitting) return;

        const confirmSubmit = window.confirm(
            'Are you sure you want to submit? You cannot change your answers after submission.'
        );

        if (!confirmSubmit && timeRemaining > 0) return;

        setIsSubmitting(true);

        try {
            if (!test || !testId) {
                showToast('Invalid test data', 'error');
                return;
            }

            // Submit test to backend
            const response = await testService.submitTest(testId, answers);

            if (response.success) {
                showToast('Test submitted successfully!', 'success');

                // Navigate to results page with backend response
                setTimeout(() => {
                    navigate(`/student/test-results/${testId}`, {
                        state: {
                            score: response.data.result.score,
                            answers,
                            test,
                        },
                    });
                }, 1000);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showToast(err.response?.data?.message || 'Failed to submit test', 'error');
            setIsSubmitting(false);
        }
    }, [isSubmitting, timeRemaining, test, testId, answers, navigate]);

    // Timer countdown
    useEffect(() => {
        if (timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, handleSubmit]);

    if (loading) {
        return (
            <div className="take-test-page">
                <Header navigationLinks={navigationLinks} />
                <div className="loading-container">
                    <div className="loading-spinner">⏳</div>
                    <p>Loading test...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!test) {
        return (
            <div className="take-test-page">
                <Header navigationLinks={navigationLinks} />
                <div className="loading-container">
                    <p>Test not found</p>
                </div>
                <Footer />
            </div>
        );
    }

    const currentQuestion = test.questions[currentQuestionIndex];
    const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
    const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

    return (
        <div className="take-test-page">
            <Header navigationLinks={navigationLinks} />

            <div className="test-container">
                {/* Test Header */}
                <div className="test-header">
                    <div className="test-info">
                        <h1>{test.title}</h1>
                        <p>{test.subject} • {test.tutorName}</p>
                    </div>
                    <div className={`timer ${timeRemaining < 300 ? 'warning' : ''}`}>
                        <span className="timer-icon">⏱️</span>
                        <span className="timer-value">{formatTime(timeRemaining)}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }} />
                    <span className="progress-text">
                        Question {currentQuestionIndex + 1} of {test.questions.length}
                    </span>
                </div>

                {/* Question Card */}
                <div className="question-card">
                    <div className="question-header">
                        <span className="question-number">Question {currentQuestionIndex + 1}</span>
                        <span className="question-points">{currentQuestion.points} points</span>
                    </div>

                    <div className="question-content">
                        <p className="question-text">{currentQuestion.content.text}</p>
                        {currentQuestion.content.image && (
                            <img
                                src={currentQuestion.content.image}
                                alt="Question"
                                className="question-image"
                            />
                        )}
                    </div>

                    {/* Answer Input */}
                    <div className="answer-section">
                        {/* Text Answer */}
                        {currentQuestion.type === 'text' && (
                            <textarea
                                className="text-answer"
                                value={currentAnswer?.answer as string || ''}
                                onChange={e => handleAnswerChange(currentQuestion.id, e.target.value)}
                                placeholder="Type your answer here..."
                                rows={5}
                            />
                        )}

                        {/* Multiple Choice */}
                        {currentQuestion.type === 'multiple-choice' && (
                            <div className="options-list">
                                {currentQuestion.options?.map(option => (
                                    <label key={option.id} className="option-label">
                                        <input
                                            type="radio"
                                            name={currentQuestion.id}
                                            value={option.id}
                                            checked={currentAnswer?.answer === option.id}
                                            onChange={e => handleAnswerChange(currentQuestion.id, e.target.value)}
                                        />
                                        <span className="option-text">{option.text}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {/* Multiple Select */}
                        {currentQuestion.type === 'multiple-select' && (
                            <div className="options-list">
                                {currentQuestion.options?.map(option => (
                                    <label key={option.id} className="option-label">
                                        <input
                                            type="checkbox"
                                            value={option.id}
                                            checked={(currentAnswer?.answer as string[])?.includes(option.id)}
                                            onChange={e => {
                                                const current = (currentAnswer?.answer as string[]) || [];
                                                const updated = e.target.checked
                                                    ? [...current, option.id]
                                                    : current.filter(id => id !== option.id);
                                                handleAnswerChange(currentQuestion.id, updated);
                                            }}
                                        />
                                        <span className="option-text">{option.text}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {/* Scale */}
                        {currentQuestion.type === 'scale' && (
                            <div className="scale-container">
                                <div className="scale-labels">
                                    <span>{currentQuestion.scaleMin}</span>
                                    <span>{currentQuestion.scaleMax}</span>
                                </div>
                                <input
                                    type="range"
                                    min={currentQuestion.scaleMin}
                                    max={currentQuestion.scaleMax}
                                    value={currentAnswer?.answer as number || currentQuestion.scaleMin}
                                    onChange={e => handleAnswerChange(currentQuestion.id, parseInt(e.target.value))}
                                    className="scale-slider"
                                />
                                <div className="scale-value">{currentAnswer?.answer || currentQuestion.scaleMin}</div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="question-navigation">
                        <button
                            className="btn btn-outline"
                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestionIndex === 0}
                        >
                            ← Previous
                        </button>

                        {currentQuestionIndex < test.questions.length - 1 ? (
                            <button
                                className="btn btn-primary"
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                className="btn btn-success"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Test'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Question Overview */}
                <div className="questions-overview">
                    <h3>Questions Overview</h3>
                    <div className="questions-grid">
                        {test.questions.map((q, index) => {
                            const answer = answers.find(a => a.questionId === q.id);
                            const isAnswered = answer && (
                                (typeof answer.answer === 'string' && answer.answer !== '') ||
                                (Array.isArray(answer.answer) && answer.answer.length > 0) ||
                                (typeof answer.answer === 'number')
                            );

                            return (
                                <button
                                    key={q.id}
                                    className={`question-btn ${index === currentQuestionIndex ? 'active' : ''} ${isAnswered ? 'answered' : ''}`}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Footer />
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
};

export default TakeTest;
