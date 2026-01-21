import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: string;
    fullScreen?: boolean;
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    color = 'var(--primary-blue)',
    fullScreen = false,
    message = 'Loading...',
}) => {
    const spinner = (
        <div className={`spinner-container ${fullScreen ? 'fullscreen' : ''}`}>
            <div className={`spinner spinner-${size}`} style={{ borderTopColor: color }}>
                <div className="spinner-inner" style={{ borderTopColor: color }}></div>
            </div>
            {message && <p className="spinner-message">{message}</p>}
        </div>
    );

    return spinner;
};

export default LoadingSpinner;
