import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const NotFound404: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="error-page">
            <div className="error-content">
                <div className="error-code">404</div>
                <h1 className="error-title">Page Not Found</h1>
                <p className="error-description">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="error-actions">
                    <button onClick={() => navigate(-1)} className="btn-secondary">
                        Go Back
                    </button>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound404;
