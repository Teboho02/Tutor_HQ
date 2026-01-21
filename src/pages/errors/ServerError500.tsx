import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const ServerError500: React.FC = () => {
    const navigate = useNavigate();

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div className="error-page">
            <div className="error-content">
                <div className="error-code">500</div>
                <h1 className="error-title">Server Error</h1>
                <p className="error-description">
                    Something went wrong on our end. We're working to fix it.
                </p>
                <div className="error-actions">
                    <button onClick={handleReload} className="btn-secondary">
                        Reload Page
                    </button>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServerError500;
