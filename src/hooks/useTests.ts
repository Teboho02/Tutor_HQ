import { useState, useEffect } from 'react';
import { testsApi } from '../api';
import { useApi } from './useApi';

/**
 * Hook to fetch student assignments
 */
export function useStudentAssignments(studentId: string | null, status?: string) {
    const [assignments, setAssignments] = useState([]);
    const { loading, error, execute } = useApi(testsApi.getStudentAssignments);

    useEffect(() => {
        if (studentId) {
            loadAssignments();
        }
    }, [studentId, status]);

    const loadAssignments = async () => {
        if (!studentId) return;
        try {
            const data = await execute(studentId, status);
            setAssignments(data);
        } catch (err) {
            console.error('Failed to load assignments:', err);
        }
    };

    const submitTest = async (assignmentId: string, answers: any[]) => {
        try {
            await testsApi.submitTest(assignmentId, answers);
            await loadAssignments(); // Refresh list
        } catch (err) {
            console.error('Failed to submit test:', err);
            throw err;
        }
    };

    return {
        assignments,
        loading,
        error,
        refresh: loadAssignments,
        submitTest,
    };
}

/**
 * Hook to fetch assignment details
 */
export function useAssignment(assignmentId: string | null) {
    const { data: assignment, loading, error, execute } = useApi(testsApi.getAssignment);

    useEffect(() => {
        if (assignmentId) {
            execute(assignmentId);
        }
    }, [assignmentId]);

    return {
        assignment,
        loading,
        error,
        refresh: () => assignmentId && execute(assignmentId),
    };
}

/**
 * Hook for tutors to manage tests
 */
export function useTests(filters?: any) {
    const [tests, setTests] = useState([]);
    const { loading, error, execute } = useApi(testsApi.getTests);

    useEffect(() => {
        loadTests();
    }, [filters]);

    const loadTests = async () => {
        try {
            const data = await execute(filters);
            setTests(data);
        } catch (err) {
            console.error('Failed to load tests:', err);
        }
    };

    const createTest = async (testData: any) => {
        try {
            const newTest = await testsApi.createTest(testData);
            await loadTests(); // Refresh list
            return newTest;
        } catch (err) {
            console.error('Failed to create test:', err);
            throw err;
        }
    };

    const assignTest = async (testId: string, studentIds: string[], dueDate?: string) => {
        try {
            await testsApi.assignTest(testId, studentIds, dueDate);
        } catch (err) {
            console.error('Failed to assign test:', err);
            throw err;
        }
    };

    const gradeSubmission = async (submissionId: string, score: number, feedback?: string) => {
        try {
            await testsApi.gradeSubmission(submissionId, score, feedback);
        } catch (err) {
            console.error('Failed to grade submission:', err);
            throw err;
        }
    };

    return {
        tests,
        loading,
        error,
        refresh: loadTests,
        createTest,
        assignTest,
        gradeSubmission,
    };
}
