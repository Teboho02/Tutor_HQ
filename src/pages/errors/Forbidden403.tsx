import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const Forbidden403: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="error-page">
            <div className="error-content">
                <div className="error-code">403</div>
                <h1 className="error-title">Access Forbidden</h1>
                <p className="error-description">
                    You don't have permission to access this resource.
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

export default Forbidden403;
