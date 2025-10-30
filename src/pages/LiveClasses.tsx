import React from 'react';
import Header from '../components/Header';

const LiveClasses: React.FC = () => {
    return (
        <div className="live-classes">
            <Header />
            <div style={{ padding: '120px 20px 40px', textAlign: 'center', minHeight: '100vh' }}>
                <h1>Live Classes</h1>
                <p>This page is under construction. Coming soon!</p>
            </div>
        </div>
    );
};

export default LiveClasses;