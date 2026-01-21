import React from 'react';
import './ErrorPages.css';

const Maintenance: React.FC = () => {
    return (
        <div className="error-page">
            <div className="error-content">
                <div className="error-icon">🔧</div>
                <h1 className="error-title">Under Maintenance</h1>
                <p className="error-description">
                    We're currently performing scheduled maintenance. We'll be back shortly.
                </p>
                <p className="error-description-secondary">
                    Thank you for your patience!
                </p>
            </div>
        </div>
    );
};

export default Maintenance;
