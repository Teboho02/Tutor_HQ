import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/AdminSettings.css';

const AdminSettings: React.FC = () => {
    const [settings, setSettings] = useState({
        platformName: 'TutorHQ',
        supportEmail: 'support@tutorhq.co.za',
        supportPhone: '+27 11 123 4567',
        currency: 'ZAR',
        timezone: 'Africa/Johannesburg',
        platformFee: 5,
        sessionDuration: 60,
        cancellationWindow: 24,
        payFastMerchantId: '',
        payFastMerchantKey: '',
        payFastPassphrase: '',
        payFastSandbox: true,
        tutorCruncherApiKey: '',
        tutorCruncherOrgId: '',
        lessonSpaceApiKey: '',
        lessonSpaceOrgId: '',
        emailNotifications: true,
        smsNotifications: false,
        whatsappNotifications: true,
        paymentReminders: true,
        classReminders: true,
        reportFrequency: 'weekly'
    });

    const handleSave = () => {
        alert('Settings saved successfully!');
    };

    const handleChange = (field: string, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="admin-settings">
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-logo">
                        <h1>🎓 TutorHQ Admin</h1>
                        <span className="admin-badge">Settings</span>
                    </div>
                    <Link to="/admin" className="back-btn">← Back to Dashboard</Link>
                </div>
            </div>

            <div className="admin-main">
                <div className="admin-container">
                    <div className="page-header">
                        <h2>System Settings</h2>
                        <p>Configure platform settings and integrations</p>
                    </div>

                    <div className="settings-grid">
                        {/* Platform Settings */}
                        <div className="settings-section">
                            <h3>🏢 Platform Settings</h3>
                            <div className="settings-form">
                                <div className="form-group">
                                    <label>Platform Name</label>
                                    <input
                                        type="text"
                                        value={settings.platformName}
                                        onChange={(e) => handleChange('platformName', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Support Email</label>
                                    <input
                                        type="email"
                                        value={settings.supportEmail}
                                        onChange={(e) => handleChange('supportEmail', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Support Phone</label>
                                    <input
                                        type="tel"
                                        value={settings.supportPhone}
                                        onChange={(e) => handleChange('supportPhone', e.target.value)}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Currency</label>
                                        <select
                                            value={settings.currency}
                                            onChange={(e) => handleChange('currency', e.target.value)}
                                        >
                                            <option value="ZAR">ZAR (South African Rand)</option>
                                            <option value="USD">USD (US Dollar)</option>
                                            <option value="EUR">EUR (Euro)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Timezone</label>
                                        <select
                                            value={settings.timezone}
                                            onChange={(e) => handleChange('timezone', e.target.value)}
                                        >
                                            <option value="Africa/Johannesburg">Africa/Johannesburg</option>
                                            <option value="Africa/Cairo">Africa/Cairo</option>
                                            <option value="Europe/London">Europe/London</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Settings */}
                        <div className="settings-section">
                            <h3>💼 Business Settings</h3>
                            <div className="settings-form">
                                <div className="form-group">
                                    <label>Platform Fee (%)</label>
                                    <input
                                        type="number"
                                        value={settings.platformFee}
                                        onChange={(e) => handleChange('platformFee', Number(e.target.value))}
                                        min="0"
                                        max="100"
                                    />
                                    <small>Percentage charged on tutor payments</small>
                                </div>
                                <div className="form-group">
                                    <label>Default Session Duration (minutes)</label>
                                    <input
                                        type="number"
                                        value={settings.sessionDuration}
                                        onChange={(e) => handleChange('sessionDuration', Number(e.target.value))}
                                        step="15"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Cancellation Window (hours)</label>
                                    <input
                                        type="number"
                                        value={settings.cancellationWindow}
                                        onChange={(e) => handleChange('cancellationWindow', Number(e.target.value))}
                                    />
                                    <small>Minimum notice required for cancellations</small>
                                </div>
                            </div>
                        </div>

                        {/* PayFast Settings */}
                        <div className="settings-section">
                            <h3>💳 PayFast Integration</h3>
                            <div className="settings-form">
                                <div className="form-group">
                                    <label>Merchant ID</label>
                                    <input
                                        type="text"
                                        value={settings.payFastMerchantId}
                                        onChange={(e) => handleChange('payFastMerchantId', e.target.value)}
                                        placeholder="10000100"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Merchant Key</label>
                                    <input
                                        type="text"
                                        value={settings.payFastMerchantKey}
                                        onChange={(e) => handleChange('payFastMerchantKey', e.target.value)}
                                        placeholder="46f0cd694581a"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Passphrase</label>
                                    <input
                                        type="password"
                                        value={settings.payFastPassphrase}
                                        onChange={(e) => handleChange('payFastPassphrase', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={settings.payFastSandbox}
                                            onChange={(e) => handleChange('payFastSandbox', e.target.checked)}
                                        />
                                        <span>Use Sandbox Mode (for testing)</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* TutorCruncher Settings */}
                        <div className="settings-section">
                            <h3>📅 TutorCruncher Integration</h3>
                            <div className="settings-form">
                                <div className="form-group">
                                    <label>API Key</label>
                                    <input
                                        type="text"
                                        value={settings.tutorCruncherApiKey}
                                        onChange={(e) => handleChange('tutorCruncherApiKey', e.target.value)}
                                        placeholder="tc_api_key_xxxxx"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Organization ID</label>
                                    <input
                                        type="text"
                                        value={settings.tutorCruncherOrgId}
                                        onChange={(e) => handleChange('tutorCruncherOrgId', e.target.value)}
                                        placeholder="org_xxxxx"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* LessonSpace Settings */}
                        <div className="settings-section">
                            <h3>🎥 LessonSpace Integration</h3>
                            <div className="settings-form">
                                <div className="form-group">
                                    <label>API Key</label>
                                    <input
                                        type="text"
                                        value={settings.lessonSpaceApiKey}
                                        onChange={(e) => handleChange('lessonSpaceApiKey', e.target.value)}
                                        placeholder="ls_api_key_xxxxx"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Organization ID</label>
                                    <input
                                        type="text"
                                        value={settings.lessonSpaceOrgId}
                                        onChange={(e) => handleChange('lessonSpaceOrgId', e.target.value)}
                                        placeholder="org_xxxxx"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notification Settings */}
                        <div className="settings-section">
                            <h3>🔔 Notification Settings</h3>
                            <div className="settings-form">
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={settings.emailNotifications}
                                            onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                        />
                                        <span>Email Notifications</span>
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={settings.smsNotifications}
                                            onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                                        />
                                        <span>SMS Notifications</span>
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={settings.whatsappNotifications}
                                            onChange={(e) => handleChange('whatsappNotifications', e.target.checked)}
                                        />
                                        <span>WhatsApp Notifications</span>
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={settings.paymentReminders}
                                            onChange={(e) => handleChange('paymentReminders', e.target.checked)}
                                        />
                                        <span>Automatic Payment Reminders</span>
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={settings.classReminders}
                                            onChange={(e) => handleChange('classReminders', e.target.checked)}
                                        />
                                        <span>Class Reminders (1 hour before)</span>
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label>Report Frequency</label>
                                    <select
                                        value={settings.reportFrequency}
                                        onChange={(e) => handleChange('reportFrequency', e.target.value)}
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="save-section">
                        <button className="save-btn" onClick={handleSave}>
                            💾 Save All Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
