import React from 'react';
import Header from '../components/Header';

const StudentTestPage: React.FC = () => {
    return (
        <div className="student-test-page">
            <Header />
            <div style={{ padding: '120px 20px 40px', textAlign: 'center', minHeight: '100vh' }}>
                <h1>Student Test Page</h1>
                <p>This page is under construction. Coming soon!</p>
            </div>
        </div>
    );
};

export default StudentTestPage;