import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logger } from '../utils/logger';
import './ErrorBoundary.css';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console and logging service
        logger.error('Error Boundary caught an error', error, {
            componentStack: errorInfo.componentStack,
        });

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo);

        // Update state with error info
        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleReload = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="error-boundary">
                    <div className="error-boundary-content">
                        <div className="error-icon">⚠️</div>
                        <h1>Oops! Something went wrong</h1>
                        <p className="error-message">
                            We're sorry, but something unexpected happened. Please try again.
                        </p>

                        {this.state.error && (
                            <details className="error-details">
                                <summary>Error Details (for developers)</summary>
                                <div className="error-stack">
                                    <strong>Error:</strong> {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack && (
                                        <>
                                            <br />
                                            <strong>Component Stack:</strong>
                                            <pre>{this.state.errorInfo.componentStack}</pre>
                                        </>
                                    )}
                                </div>
                            </details>
                        )}

                        <div className="error-actions">
                            <button className="btn btn-primary" onClick={this.handleReset}>
                                Try Again
                            </button>
                            <button className="btn btn-secondary" onClick={this.handleReload}>
                                Reload Page
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => (window.location.href = '/')}
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
