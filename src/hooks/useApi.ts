import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    immediate?: boolean;
}

/**
 * Generic hook for API calls with loading and error states
 */
export function useApi<T = any>(
    apiFunction: (...args: any[]) => Promise<T>,
    options: UseApiOptions<T> = {}
) {
    const { onSuccess, onError, immediate = false } = options;

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState<any>(null);

    const execute = useCallback(
        async (...args: any[]) => {
            try {
                setLoading(true);
                setError(null);
                const result = await apiFunction(...args);
                setData(result);
                onSuccess?.(result);
                return result;
            } catch (err) {
                setError(err);
                onError?.(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [apiFunction, onSuccess, onError]
    );

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, []);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return {
        data,
        loading,
        error,
        execute,
        reset,
    };
}

/**
 * Hook for paginated API calls
 */
export function usePaginatedApi<T = any>(
    apiFunction: (page: number, limit: number, ...args: any[]) => Promise<{ data: T[]; total: number }>,
    initialLimit = 10
) {
    const [data, setData] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(initialLimit);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchPage = useCallback(
        async (pageNum: number, ...args: any[]) => {
            try {
                setLoading(true);
                setError(null);
                const result = await apiFunction(pageNum, limit, ...args);
                setData(result.data);
                setTotal(result.total);
                setPage(pageNum);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        },
        [apiFunction, limit]
    );

    const nextPage = useCallback(
        (...args: any[]) => {
            if (page * limit < total) {
                return fetchPage(page + 1, ...args);
            }
        },
        [page, limit, total, fetchPage]
    );

    const previousPage = useCallback(
        (...args: any[]) => {
            if (page > 1) {
                return fetchPage(page - 1, ...args);
            }
        },
        [page, fetchPage]
    );

    const goToPage = useCallback(
        (pageNum: number, ...args: any[]) => {
            if (pageNum >= 1 && pageNum <= Math.ceil(total / limit)) {
                return fetchPage(pageNum, ...args);
            }
        },
        [total, limit, fetchPage]
    );

    return {
        data,
        page,
        limit,
        total,
        loading,
        error,
        fetchPage,
        nextPage,
        previousPage,
        goToPage,
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
        totalPages: Math.ceil(total / limit),
    };
}

/**
 * Hook for optimistic updates
 */
export function useOptimisticUpdate<T>(
    apiFunction: (...args: any[]) => Promise<T>,
    getCurrentData: () => T[],
    setCurrentData: (data: T[]) => void
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const execute = useCallback(
        async (optimisticData: T, ...args: any[]) => {
            const previousData = getCurrentData();

            try {
                // Optimistically update UI
                setCurrentData([...previousData, optimisticData]);
                setLoading(true);
                setError(null);

                // Make API call
                const result = await apiFunction(...args);

                // Replace optimistic data with real data
                const updatedData = getCurrentData().map(item =>
                    item === optimisticData ? result : item
                );
                setCurrentData(updatedData);

                return result;
            } catch (err) {
                // Revert on error
                setCurrentData(previousData);
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [apiFunction, getCurrentData, setCurrentData]
    );

    return { execute, loading, error };
}
