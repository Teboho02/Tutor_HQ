import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
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
    const [startTime] = useState(new Date().toISOString());

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
        { label: 'Tests', href: '/student/tests' },
        { label: 'Goals', href: '/student/goals' },
    ];

    // Mock test data - in production, fetch from API
    useEffect(() => {
        const mockTest: Test = {
            id: testId || '1',
            title: 'Mathematics Midterm Exam',
            subject: 'Mathematics',
            description: 'This test covers chapters 1-5. Please read each question carefully.',
            tutorId: '1',
            tutorName: 'Mr. Smith',
            scheduledDate: '2025-11-05',
            scheduledTime: '14:00',
            duration: 90,
            totalPoints: 100,
            studentIds: ['student1'],
            status: 'active',
            createdAt: '2025-10-20',
            questions: [
                {
                    id: 'q1',
                    type: 'multiple-choice',
                    content: { text: 'What is the value of π (pi) approximately?' },
                    options: [
                        { id: 'opt1', text: '2.14', isCorrect: false },
                        { id: 'opt2', text: '3.14', isCorrect: true },
                        { id: 'opt3', text: '4.14', isCorrect: false },
                        { id: 'opt4', text: '5.14', isCorrect: false },
                    ],
                    points: 10,
                },
                {
                    id: 'q2',
                    type: 'text',
                    content: { text: 'Solve for x: 2x + 5 = 15' },
                    correctAnswer: '5',
                    points: 15,
                },
                {
                    id: 'q3',
                    type: 'multiple-select',
                    content: { text: 'Which of the following are prime numbers?' },
                    options: [
                        { id: 'opt1', text: '2', isCorrect: true },
                        { id: 'opt2', text: '4', isCorrect: false },
                        { id: 'opt3', text: '7', isCorrect: true },
                        { id: 'opt4', text: '9', isCorrect: false },
                        { id: 'opt5', text: '11', isCorrect: true },
                    ],
                    points: 20,
                },
                {
                    id: 'q4',
                    type: 'scale',
                    content: { text: 'On a scale of 1-10, how confident are you in solving quadratic equations?' },
                    scaleMin: 1,
                    scaleMax: 10,
                    correctScale: 7,
                    points: 5,
                },
            ],
        };

        setTest(mockTest);
        setTimeRemaining(mockTest.duration * 60); // Convert to seconds

        // Initialize answers array
        const initialAnswers: StudentAnswer[] = mockTest.questions.map(q => ({
            questionId: q.id,
            answer: q.type === 'multiple-select' ? [] : '',
        }));
        setAnswers(initialAnswers);
    }, [testId]);

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
    }, [timeRemaining]);

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

    const handleSubmit = async () => {
        if (isSubmitting) return;

        const confirmSubmit = window.confirm(
            'Are you sure you want to submit? You cannot change your answers after submission.'
        );

        if (!confirmSubmit && timeRemaining > 0) return;

        setIsSubmitting(true);

        // Calculate score (simplified - in production, do this on backend)
        let score = 0;
        test?.questions.forEach(question => {
            const answer = answers.find(a => a.questionId === question.id);
            if (!answer) return;

            if (question.type === 'multiple-choice') {
                const selectedOption = question.options?.find(opt => opt.id === answer.answer);
                if (selectedOption?.isCorrect) score += question.points;
            } else if (question.type === 'multiple-select') {
                const correctIds = question.options?.filter(opt => opt.isCorrect).map(opt => opt.id) || [];
                const selectedIds = answer.answer as string[];
                if (JSON.stringify(correctIds.sort()) === JSON.stringify(selectedIds.sort())) {
                    score += question.points;
                }
            } else if (question.type === 'text') {
                const studentAnswerText = typeof answer.answer === 'string' ? answer.answer : '';
                const correctAnswerText = typeof question.correctAnswer === 'string' ? question.correctAnswer : '';
                if (studentAnswerText.toLowerCase().trim() === correctAnswerText.toLowerCase().trim()) {
                    score += question.points;
                }
            } else if (question.type === 'scale') {
                if (answer.answer === question.correctScale) {
                    score += question.points;
                }
            }
        });

        // In production, submit to API here
        console.log('Submitting test:', {
            testId: test?.id,
            answers,
            score,
            totalPoints: test?.totalPoints,
            startTime,
            endTime: new Date().toISOString(),
        });

        // Navigate to results page
        setTimeout(() => {
            navigate(`/student/test-results/${test?.id}`, {
                state: { score, answers, test },
            });
        }, 500);
    };

    if (!test) {
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
        </div>
    );
};

export default TakeTest;
