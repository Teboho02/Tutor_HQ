import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const Unauthorized401: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="error-page">
            <div className="error-content">
                <div className="error-code">401</div>
                <h1 className="error-title">Authentication Required</h1>
                <p className="error-description">
                    You need to be logged in to access this page.
                </p>
                <div className="error-actions">
                    <button onClick={() => navigate('/login')} className="btn-primary">
                        Log In
                    </button>
                    <button onClick={() => navigate('/')} className="btn-secondary">
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized401;
