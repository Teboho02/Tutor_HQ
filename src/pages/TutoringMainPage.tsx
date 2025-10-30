import React from 'react';
import Header from '../components/Header';

const TutoringMainPage: React.FC = () => {
    return (
        <div className="tutoring-main-page">
            <Header variant="dark" />
            <div style={{ padding: '120px 20px 40px', textAlign: 'center', minHeight: '100vh', background: '#0f0f23', color: 'white' }}>
                <h1>Tutoring Main Page</h1>
                <p>This page is under construction. Coming soon!</p>
            </div>
        </div>
    );
};

export default TutoringMainPage;