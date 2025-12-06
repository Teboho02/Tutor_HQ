import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { FinancialReport, AcademicReport } from '../../types/admin';
import '../../styles/AdminReports.css';

const AdminReports: React.FC = () => {
    const [reportType, setReportType] = useState<'financial' | 'academic'>('financial');

    // Mock financial report
    const [financialReport] = useState<FinancialReport>({
        period: 'January 2025',
        revenue: {
            tuitionFees: 1150000,
            materialSales: 45000,
            registrationFees: 52580,
            other: 0
        },
        expenses: {
            tutorPayouts: 580000,
            platformCosts: 125000,
            marketing: 78000,
            administration: 45000,
            other: 23000
        },
        netProfit: 396580,
        profitMargin: 31.8
    });

    // Mock academic report
    const [academicReport] = useState<AcademicReport>({
        period: 'January 2025',
        totalStudents: 156,
        averageAttendance: 87.3,
        platformAverage: 74.2,
        subjectAverages: [
            { subject: 'Mathematics', average: 72, studentCount: 45 },
            { subject: 'Physical Sciences', average: 68, studentCount: 38 },
            { subject: 'Life Sciences', average: 75, studentCount: 32 },
            { subject: 'English', average: 79, studentCount: 52 },
            { subject: 'Accounting', average: 71, studentCount: 28 }
        ],
        improvementRate: 15.3,
        flaggedStudents: 12
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleExportPDF = () => {
        alert('Generating PDF report...');
    };

    const handleExportExcel = () => {
        alert('Generating Excel report...');
    };

    const totalRevenue = Object.values(financialReport.revenue).reduce((a, b) => a + b, 0);
    const totalExpenses = Object.values(financialReport.expenses).reduce((a, b) => a + b, 0);

    return (
        <div className="admin-reports">
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-logo">
                        <h1>🎓 TutorHQ Admin</h1>
                        <span className="admin-badge">Reports</span>
                    </div>
                    <Link to="/admin" className="back-btn">← Back to Dashboard</Link>
                </div>
            </div>

            <div className="admin-main">
                <div className="admin-container">
                    <div className="page-header">
                        <div>
                            <h2>Reports & Analytics</h2>
                            <p>Generate financial and academic reports</p>
                        </div>
                        <div className="export-buttons">
                            <button className="export-btn pdf" onClick={handleExportPDF}>
                                📄 Export PDF
                            </button>
                            <button className="export-btn excel" onClick={handleExportExcel}>
                                📊 Export Excel
                            </button>
                        </div>
                    </div>

                    <div className="report-tabs">
                        <button
                            className={`tab ${reportType === 'financial' ? 'active' : ''}`}
                            onClick={() => setReportType('financial')}
                        >
                            💰 Financial Report
                        </button>
                        <button
                            className={`tab ${reportType === 'academic' ? 'active' : ''}`}
                            onClick={() => setReportType('academic')}
                        >
                            📚 Academic Report
                        </button>
                    </div>

                    {reportType === 'financial' && (
                        <div className="report-content">
                            <div className="report-header">
                                <h3>Financial Report - {financialReport.period}</h3>
                            </div>

                            <div className="summary-cards">
                                <div className="summary-card revenue">
                                    <div className="card-icon">💵</div>
                                    <div className="card-content">
                                        <div className="card-label">Total Revenue</div>
                                        <div className="card-value">{formatCurrency(totalRevenue)}</div>
                                    </div>
                                </div>
                                <div className="summary-card expenses">
                                    <div className="card-icon">💸</div>
                                    <div className="card-content">
                                        <div className="card-label">Total Expenses</div>
                                        <div className="card-value">{formatCurrency(totalExpenses)}</div>
                                    </div>
                                </div>
                                <div className="summary-card profit">
                                    <div className="card-icon">📈</div>
                                    <div className="card-content">
                                        <div className="card-label">Net Profit</div>
                                        <div className="card-value">{formatCurrency(financialReport.netProfit)}</div>
                                        <div className="card-detail">{financialReport.profitMargin}% margin</div>
                                    </div>
                                </div>
                            </div>

                            <div className="financial-sections">
                                <div className="financial-section">
                                    <h4>Revenue Breakdown</h4>
                                    <div className="breakdown-list">
                                        <div className="breakdown-item">
                                            <span className="item-label">Tuition Fees</span>
                                            <span className="item-value">{formatCurrency(financialReport.revenue.tuitionFees)}</span>
                                        </div>
                                        <div className="breakdown-item">
                                            <span className="item-label">Material Sales</span>
                                            <span className="item-value">{formatCurrency(financialReport.revenue.materialSales)}</span>
                                        </div>
                                        <div className="breakdown-item">
                                            <span className="item-label">Registration Fees</span>
                                            <span className="item-value">{formatCurrency(financialReport.revenue.registrationFees)}</span>
                                        </div>
                                        <div className="breakdown-item total">
                                            <span className="item-label">Total Revenue</span>
                                            <span className="item-value">{formatCurrency(totalRevenue)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="financial-section">
                                    <h4>Expense Breakdown</h4>
                                    <div className="breakdown-list">
                                        <div className="breakdown-item">
                                            <span className="item-label">Tutor Payouts</span>
                                            <span className="item-value expense">{formatCurrency(financialReport.expenses.tutorPayouts)}</span>
                                        </div>
                                        <div className="breakdown-item">
                                            <span className="item-label">Platform Costs</span>
                                            <span className="item-value expense">{formatCurrency(financialReport.expenses.platformCosts)}</span>
                                        </div>
                                        <div className="breakdown-item">
                                            <span className="item-label">Marketing</span>
                                            <span className="item-value expense">{formatCurrency(financialReport.expenses.marketing)}</span>
                                        </div>
                                        <div className="breakdown-item">
                                            <span className="item-label">Administration</span>
                                            <span className="item-value expense">{formatCurrency(financialReport.expenses.administration)}</span>
                                        </div>
                                        <div className="breakdown-item">
                                            <span className="item-label">Other</span>
                                            <span className="item-value expense">{formatCurrency(financialReport.expenses.other)}</span>
                                        </div>
                                        <div className="breakdown-item total">
                                            <span className="item-label">Total Expenses</span>
                                            <span className="item-value expense">{formatCurrency(totalExpenses)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="profit-section">
                                <div className="profit-card">
                                    <h4>Net Profit</h4>
                                    <div className="profit-value">{formatCurrency(financialReport.netProfit)}</div>
                                    <div className="profit-margin">Profit Margin: {financialReport.profitMargin}%</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {reportType === 'academic' && (
                        <div className="report-content">
                            <div className="report-header">
                                <h3>Academic Report - {academicReport.period}</h3>
                            </div>

                            <div className="summary-cards">
                                <div className="summary-card students">
                                    <div className="card-icon">👨‍🎓</div>
                                    <div className="card-content">
                                        <div className="card-label">Total Students</div>
                                        <div className="card-value">{academicReport.totalStudents}</div>
                                    </div>
                                </div>
                                <div className="summary-card average">
                                    <div className="card-icon">📊</div>
                                    <div className="card-content">
                                        <div className="card-label">Platform Average</div>
                                        <div className="card-value">{academicReport.platformAverage}%</div>
                                    </div>
                                </div>
                                <div className="summary-card attendance">
                                    <div className="card-icon">✅</div>
                                    <div className="card-content">
                                        <div className="card-label">Attendance Rate</div>
                                        <div className="card-value">{academicReport.averageAttendance}%</div>
                                    </div>
                                </div>
                                <div className="summary-card improvement">
                                    <div className="card-icon">📈</div>
                                    <div className="card-content">
                                        <div className="card-label">Improvement Rate</div>
                                        <div className="card-value">+{academicReport.improvementRate}%</div>
                                    </div>
                                </div>
                            </div>

                            <div className="academic-section">
                                <h4>Subject Performance</h4>
                                <div className="subjects-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Subject</th>
                                                <th>Students</th>
                                                <th>Average</th>
                                                <th>Performance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {academicReport.subjectAverages.map(subject => (
                                                <tr key={subject.subject}>
                                                    <td className="subject-name">{subject.subject}</td>
                                                    <td>{subject.studentCount}</td>
                                                    <td className="subject-average">{subject.average}%</td>
                                                    <td>
                                                        <div className="performance-bar">
                                                            <div
                                                                className="performance-fill"
                                                                style={{
                                                                    width: `${subject.average}%`,
                                                                    background: subject.average >= 75 ? '#10b981' :
                                                                        subject.average >= 60 ? '#f59e0b' : '#ef4444'
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {academicReport.flaggedStudents > 0 && (
                                <div className="alert-section">
                                    <div className="alert-icon">⚠️</div>
                                    <div className="alert-content">
                                        <h4>Students Requiring Attention</h4>
                                        <p>{academicReport.flaggedStudents} students have been flagged for low performance or attendance</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
