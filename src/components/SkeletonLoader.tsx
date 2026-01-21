import React from 'react';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
    variant?: 'text' | 'title' | 'circle' | 'rectangle' | 'card';
    width?: string;
    height?: string;
    count?: number;
    className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    variant = 'text',
    width,
    height,
    count = 1,
    className = '',
}) => {
    const getSkeletonClass = () => {
        switch (variant) {
            case 'text':
                return 'skeleton-text';
            case 'title':
                return 'skeleton-title';
            case 'circle':
                return 'skeleton-circle';
            case 'rectangle':
                return 'skeleton-rectangle';
            case 'card':
                return 'skeleton-card';
            default:
                return 'skeleton-text';
        }
    };

    const style: React.CSSProperties = {};
    if (width) style.width = width;
    if (height) style.height = height;

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={`skeleton ${getSkeletonClass()} ${className}`}
                    style={style}
                />
            ))}
        </>
    );
};

// Preset skeleton components
export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
    <>
        {Array.from({ length: lines }).map((_, i) => (
            <SkeletonLoader
                key={i}
                variant="text"
                width={i === lines - 1 ? '70%' : '100%'}
            />
        ))}
    </>
);

export const SkeletonCard: React.FC = () => (
    <div className="skeleton-card-wrapper">
        <SkeletonLoader variant="rectangle" height="200px" />
        <div className="skeleton-card-content">
            <SkeletonLoader variant="title" />
            <SkeletonText lines={3} />
        </div>
    </div>
);

export const SkeletonProfile: React.FC = () => (
    <div className="skeleton-profile-wrapper">
        <SkeletonLoader variant="circle" width="80px" height="80px" />
        <div className="skeleton-profile-content">
            <SkeletonLoader variant="title" width="200px" />
            <SkeletonLoader variant="text" width="150px" />
        </div>
    </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
    rows = 5,
    columns = 4,
}) => (
    <div className="skeleton-table">
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="skeleton-table-row">
                {Array.from({ length: columns }).map((_, colIndex) => (
                    <SkeletonLoader key={colIndex} variant="text" />
                ))}
            </div>
        ))}
    </div>
);

export default SkeletonLoader;
