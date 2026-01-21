import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const NetworkError: React.FC = () => {
    const navigate = useNavigate();

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="error-page">
            <div className="error-content">
                <div className="error-icon">🌐</div>
                <h1 className="error-title">Network Error</h1>
                <p className="error-description">
                    Unable to connect to the server. Please check your internet connection and try again.
                </p>
                <div className="error-actions">
                    <button onClick={handleRetry} className="btn-primary">
                        Retry
                    </button>
                    <button onClick={() => navigate('/')} className="btn-secondary">
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NetworkError;
