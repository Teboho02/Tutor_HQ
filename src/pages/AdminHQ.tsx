import React from 'react';
import Header from '../components/Header';

const AdminHQ: React.FC = () => {
    return (
        <div className="admin-hq">
            <Header />
            <div style={{ padding: '120px 20px 40px', textAlign: 'center', minHeight: '100vh' }}>
                <h1>Admin HQ</h1>
                <p>This page is under construction. Coming soon!</p>
            </div>
        </div>
    );
};

export default AdminHQ;