import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { NavigationLink } from '../../../types';
import type { Test, Question, StudentAnswer } from '../../../types/test';
import './TestResults.css';

interface ResultState {
    score: number;
    answers: StudentAnswer[];
    test: Test;
}

const TestResults: React.FC = () => {
    const { testId } = useParams<{ testId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [resultData, setResultData] = useState<ResultState | null>(null);

    const navigationLinks: NavigationLink[] = [
        { label: 'Dashboard', href: '/student/dashboard' },
        { label: 'Live Classes', href: '/student/live-classes' },
        { label: 'Calendar', href: '/student/calendar' },
        { label: 'Materials', href: '/student/materials' },
        { label: 'Progress', href: '/student/progress' },
        { label: 'Tests', href: '/student/tests' },
        { label: 'Messages', href: '/student/messages' },
    ];

    useEffect(() => {
        // In production, fetch from API: GET /api/tests/${testId}/results
        // For now, use location state from TakeTest navigation
        if (location.state) {
            setResultData(location.state as ResultState);
        } else {
            // Mock data if direct navigation
            const mockTest: Test = {
                id: testId || '1',
                title: 'Mathematics Midterm Exam',
                subject: 'Mathematics',
                description: '',
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
                ],
            };

            setResultData({
                score: 27,
                test: mockTest,
                answers: [
                    { questionId: 'q1', answer: 'opt2' },
                    { questionId: 'q2', answer: '5' },
                ],
            });
        }
    }, [testId, location]);

    const getLetterGrade = (percentage: number): string => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 50) return 'D';
        return 'F';
    };

    const getGradeColor = (percentage: number): string => {
        if (percentage >= 80) return '#48bb78';
        if (percentage >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const checkAnswer = (question: Question, answer: StudentAnswer): { isCorrect: boolean; earnedPoints: number } => {
        if (!answer || !answer.answer) return { isCorrect: false, earnedPoints: 0 };

        if (question.type === 'multiple-choice') {
            const selectedOption = question.options?.find(opt => opt.id === answer.answer);
            const isCorrect = selectedOption?.isCorrect || false;
            return { isCorrect, earnedPoints: isCorrect ? question.points : 0 };
        }

        if (question.type === 'multiple-select') {
            const correctIds = question.options?.filter(opt => opt.isCorrect).map(opt => opt.id).sort() || [];
            const selectedIds = (answer.answer as string[]).sort();
            const isCorrect = JSON.stringify(correctIds) === JSON.stringify(selectedIds);
            return { isCorrect, earnedPoints: isCorrect ? question.points : 0 };
        }

        if (question.type === 'text') {
            const studentAnswerText = typeof answer.answer === 'string' ? answer.answer : '';
            const correctAnswerText = typeof question.correctAnswer === 'string' ? question.correctAnswer : '';
            const isCorrect = studentAnswerText.toLowerCase().trim() === correctAnswerText.toLowerCase().trim();
            return { isCorrect, earnedPoints: isCorrect ? question.points : 0 };
        }

        if (question.type === 'scale') {
            const isCorrect = answer.answer === question.correctScale;
            return { isCorrect, earnedPoints: isCorrect ? question.points : 0 };
        }

        return { isCorrect: false, earnedPoints: 0 };
    };

    const getCorrectAnswerText = (question: Question): string => {
        if (question.type === 'multiple-choice') {
            return question.options?.find(opt => opt.isCorrect)?.text || '';
        }

        if (question.type === 'multiple-select') {
            return question.options?.filter(opt => opt.isCorrect).map(opt => opt.text).join(', ') || '';
        }

        if (question.type === 'text') {
            return typeof question.correctAnswer === 'string' ? question.correctAnswer : '';
        }

        if (question.type === 'scale') {
            return question.correctScale?.toString() || '';
        }

        return '';
    };

    const getStudentAnswerText = (question: Question, answer: StudentAnswer): string => {
        if (!answer || !answer.answer) return 'Not answered';

        if (question.type === 'multiple-choice') {
            return question.options?.find(opt => opt.id === answer.answer)?.text || '';
        }

        if (question.type === 'multiple-select') {
            const selectedIds = answer.answer as string[];
            return question.options?.filter(opt => selectedIds.includes(opt.id)).map(opt => opt.text).join(', ') || '';
        }

        if (question.type === 'text' || question.type === 'scale') {
            return answer.answer.toString();
        }

        return '';
    };

    if (!resultData) {
        return (
            <div className="test-results-page">
                <Header navigationLinks={navigationLinks} />
                <div className="loading-container">
                    <div className="loading-spinner">⏳</div>
                    <p>Loading results...</p>
                </div>
                <Footer />
            </div>
        );
    }

    const { score, test, answers } = resultData;
    const percentage = (score / test.totalPoints) * 100;
    const letterGrade = getLetterGrade(percentage);
    const gradeColor = getGradeColor(percentage);

    return (
        <div className="test-results-page">
            <Header navigationLinks={navigationLinks} />

            <div className="results-container">
                {/* Results Header */}
                <div className="results-header">
                    <div className="test-title-section">
                        <h1>{test.title}</h1>
                        <p>{test.subject} • {test.tutorName}</p>
                    </div>

                    <div className="score-summary" style={{ borderColor: gradeColor }}>
                        <div className="score-main" style={{ color: gradeColor }}>
                            <span className="score-value">{score}</span>
                            <span className="score-divider">/</span>
                            <span className="score-total">{test.totalPoints}</span>
                        </div>
                        <div className="grade-info">
                            <span className="percentage">{percentage.toFixed(1)}%</span>
                            <span className="letter-grade" style={{ backgroundColor: gradeColor }}>
                                {letterGrade}
                            </span>
                        </div>
                        <div className="pass-status" style={{ color: percentage >= 50 ? '#48bb78' : '#ef4444' }}>
                            {percentage >= 50 ? '✓ Passed' : '✗ Failed'}
                        </div>
                    </div>
                </div>

                {/* Questions Review */}
                <div className="questions-review">
                    <h2>Question Review</h2>

                    {test.questions.map((question, index) => {
                        const studentAnswer = answers.find(a => a.questionId === question.id);
                        const { isCorrect, earnedPoints } = studentAnswer ? checkAnswer(question, studentAnswer) : { isCorrect: false, earnedPoints: 0 };

                        return (
                            <div key={question.id} className={`review-card ${isCorrect ? 'correct' : 'incorrect'}`}>
                                <div className="review-header">
                                    <div className="review-title">
                                        <span className="review-number">Question {index + 1}</span>
                                        <span className={`review-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                                            {isCorrect ? '✓' : '✗'}
                                        </span>
                                    </div>
                                    <div className="review-points">
                                        <span className="earned-points" style={{ color: isCorrect ? '#48bb78' : '#ef4444' }}>
                                            {earnedPoints}
                                        </span>
                                        <span className="points-divider">/</span>
                                        <span className="total-points">{question.points}</span>
                                        <span className="points-label">pts</span>
                                    </div>
                                </div>

                                <div className="review-content">
                                    <p className="review-question">{question.content.text}</p>
                                    {question.content.image && (
                                        <img
                                            src={question.content.image}
                                            alt="Question"
                                            className="review-image"
                                        />
                                    )}
                                </div>

                                <div className="answer-comparison">
                                    <div className="answer-box your-answer">
                                        <label>Your Answer:</label>
                                        <p className={isCorrect ? 'correct-text' : 'incorrect-text'}>
                                            {studentAnswer ? getStudentAnswerText(question, studentAnswer) : 'Not answered'}
                                        </p>
                                    </div>

                                    {!isCorrect && (
                                        <div className="answer-box correct-answer">
                                            <label>Correct Answer:</label>
                                            <p className="correct-text">{getCorrectAnswerText(question)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Action Buttons */}
                <div className="results-actions">
                    <button className="btn btn-outline" onClick={() => navigate('/student/tests')}>
                        ← Back to Tests
                    </button>
                    <button className="btn btn-primary" onClick={() => window.print()}>
                        📄 Download Results
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TestResults;
