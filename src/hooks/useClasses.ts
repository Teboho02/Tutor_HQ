import { useState, useEffect } from 'react';
import { classesApi } from '../api';
import { useApi } from './useApi';

/**
 * Hook to fetch and manage classes
 */
export function useClasses(filters?: any) {
    const [classes, setClasses] = useState([]);
    const { loading, error, execute } = useApi(classesApi.getClasses);

    useEffect(() => {
        loadClasses();
    }, [filters]);

    const loadClasses = async () => {
        try {
            const data = await execute(filters);
            setClasses(data);
        } catch (err) {
            console.error('Failed to load classes:', err);
        }
    };

    const enrollInClass = async (classId: string) => {
        try {
            await classesApi.enrollInClass(classId);
            await loadClasses(); // Refresh list
        } catch (err) {
            console.error('Failed to enroll:', err);
            throw err;
        }
    };

    const unenrollFromClass = async (classId: string) => {
        try {
            await classesApi.unenrollFromClass(classId);
            await loadClasses(); // Refresh list
        } catch (err) {
            console.error('Failed to unenroll:', err);
            throw err;
        }
    };

    return {
        classes,
        loading,
        error,
        refresh: loadClasses,
        enrollInClass,
        unenrollFromClass,
    };
}

/**
 * Hook to fetch single class details
 */
export function useClass(classId: string | null) {
    const { data: classData, loading, error, execute } = useApi(classesApi.getClass);

    useEffect(() => {
        if (classId) {
            execute(classId);
        }
    }, [classId]);

    return {
        classData,
        loading,
        error,
        refresh: () => classId && execute(classId),
    };
}
