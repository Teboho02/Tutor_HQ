import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextValue {
    showToast: (message: string, type: ToastType, duration?: number) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType, duration = 5000) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const toast: Toast = { id, message, type, duration };

        setToasts((prev) => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                hideToast(id);
            }, duration);
        }
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <ToastContainer toasts={toasts} onClose={hideToast} />
        </ToastContext.Provider>
    );
};

interface ToastContainerProps {
    toasts: Toast[];
    onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
    return (
        <div className="toast-container" role="region" aria-live="polite" aria-label="Notifications">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={onClose} />
            ))}
        </div>
    );
};

interface ToastItemProps {
    toast: Toast;
    onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
                return 'ℹ';
            default:
                return 'ℹ';
        }
    };

    return (
        <div className={`toast toast-${toast.type}`} role="alert">
            <div className="toast-icon">{getIcon()}</div>
            <div className="toast-message">{toast.message}</div>
            <button
                className="toast-close"
                onClick={() => onClose(toast.id)}
                aria-label="Close notification"
            >
                ×
            </button>
        </div>
    );
};

export default ToastProvider;
