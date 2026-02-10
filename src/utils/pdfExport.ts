/**
 * PDF Export Utility
 * Generate PDF reports for student progress, test results, and analytics
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface StudentProgressData {
    studentName: string;
    studentId: string;
    grade: string;
    period: string;
    subjects: Array<{
        name: string;
        average: number;
        attendance: number;
        assignments: number;
        tests: number;
    }>;
    overallAverage: number;
    attendanceRate: number;
    comments?: string;
}

export interface TestReportData {
    testName: string;
    subject: string;
    date: string;
    totalMarks: number;
    students: Array<{
        name: string;
        score: number;
        percentage: number;
        grade: string;
    }>;
    classAverage: number;
    highestScore: number;
    lowestScore: number;
}

class PDFExporter {
    private doc: jsPDF;
    private readonly primaryColor = '#0066ff';
    private readonly textColor = '#333333';

    constructor() {
        this.doc = new jsPDF();
    }

    // Add header to PDF
    private addHeader(title: string): void {
        this.doc.setFontSize(20);
        this.doc.setTextColor(this.primaryColor);
        this.doc.text('TutorHQ', 14, 20);

        this.doc.setFontSize(16);
        this.doc.text(title, 14, 30);

        // Add line under header
        this.doc.setDrawColor(this.primaryColor);
        this.doc.setLineWidth(0.5);
        this.doc.line(14, 35, 196, 35);
    }

    // Add footer to PDF
    private addFooter(pageNumber: number): void {
        const pageCount = this.doc.getNumberOfPages();
        this.doc.setFontSize(8);
        this.doc.setTextColor(this.textColor);
        this.doc.text(
            `Page ${pageNumber} of ${pageCount}`,
            14,
            this.doc.internal.pageSize.height - 10
        );
        this.doc.text(
            `Generated on ${new Date().toLocaleDateString()}`,
            this.doc.internal.pageSize.width - 14,
            this.doc.internal.pageSize.height - 10,
            { align: 'right' }
        );
    }

    // Export Student Progress Report
    exportStudentProgress(data: StudentProgressData): void {
        this.doc = new jsPDF();
        this.addHeader('Student Progress Report');

        // Student Information
        let yPos = 45;
        this.doc.setFontSize(12);
        this.doc.setTextColor(this.textColor);

        this.doc.text(`Student Name: ${data.studentName}`, 14, yPos);
        yPos += 7;
        this.doc.text(`Student ID: ${data.studentId}`, 14, yPos);
        yPos += 7;
        this.doc.text(`Grade: ${data.grade}`, 14, yPos);
        yPos += 7;
        this.doc.text(`Period: ${data.period}`, 14, yPos);
        yPos += 10;

        // Overall Statistics
        this.doc.setFontSize(14);
        this.doc.setTextColor(this.primaryColor);
        this.doc.text('Overall Performance', 14, yPos);
        yPos += 7;

        this.doc.setFontSize(11);
        this.doc.setTextColor(this.textColor);
        this.doc.text(`Overall Average: ${data.overallAverage}%`, 14, yPos);
        yPos += 7;
        this.doc.text(`Attendance Rate: ${data.attendanceRate}%`, 14, yPos);
        yPos += 10;

        // Subject Performance Table
        autoTable(this.doc, {
            startY: yPos,
            head: [['Subject', 'Average', 'Attendance', 'Assignments', 'Tests']],
            body: data.subjects.map(subject => [
                subject.name,
                `${subject.average}%`,
                `${subject.attendance}%`,
                `${subject.assignments}`,
                `${subject.tests}`,
            ]),
            theme: 'striped',
            headStyles: {
                fillColor: this.primaryColor,
                textColor: '#ffffff',
            },
            styles: {
                fontSize: 10,
            },
        });

        // Comments section if available
        if (data.comments) {
            const finalY = (this.doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY || yPos + 50;
            this.doc.setFontSize(14);
            this.doc.setTextColor(this.primaryColor);
            this.doc.text('Comments', 14, finalY + 10);

            this.doc.setFontSize(10);
            this.doc.setTextColor(this.textColor);
            const splitComments = this.doc.splitTextToSize(data.comments, 180);
            this.doc.text(splitComments, 14, finalY + 17);
        }

        this.addFooter(1);
        this.doc.save(`${data.studentName}_Progress_Report.pdf`);
    }

    // Export Test Report
    exportTestReport(data: TestReportData): void {
        this.doc = new jsPDF();
        this.addHeader('Test Report');

        // Test Information
        let yPos = 45;
        this.doc.setFontSize(12);
        this.doc.setTextColor(this.textColor);

        this.doc.text(`Test Name: ${data.testName}`, 14, yPos);
        yPos += 7;
        this.doc.text(`Subject: ${data.subject}`, 14, yPos);
        yPos += 7;
        this.doc.text(`Date: ${data.date}`, 14, yPos);
        yPos += 7;
        this.doc.text(`Total Marks: ${data.totalMarks}`, 14, yPos);
        yPos += 10;

        // Statistics
        this.doc.setFontSize(14);
        this.doc.setTextColor(this.primaryColor);
        this.doc.text('Class Statistics', 14, yPos);
        yPos += 7;

        this.doc.setFontSize(11);
        this.doc.setTextColor(this.textColor);
        this.doc.text(`Class Average: ${data.classAverage}%`, 14, yPos);
        yPos += 7;
        this.doc.text(`Highest Score: ${data.highestScore}`, 14, yPos);
        yPos += 7;
        this.doc.text(`Lowest Score: ${data.lowestScore}`, 14, yPos);
        yPos += 10;

        // Student Results Table
        autoTable(this.doc, {
            startY: yPos,
            head: [['Student Name', 'Score', 'Percentage', 'Grade']],
            body: data.students.map(student => [
                student.name,
                student.score.toString(),
                `${student.percentage}%`,
                student.grade,
            ]),
            theme: 'striped',
            headStyles: {
                fillColor: this.primaryColor,
                textColor: '#ffffff',
            },
            styles: {
                fontSize: 10,
            },
        });

        this.addFooter(1);
        this.doc.save(`${data.testName}_Report.pdf`);
    }

    // Export Class Schedule
    exportClassSchedule(
        tutorName: string,
        schedule: Array<{
            day: string;
            time: string;
            subject: string;
            students: string;
            module: string;
        }>
    ): void {
        this.doc = new jsPDF();
        this.addHeader('Class Schedule');

        let yPos = 45;
        this.doc.setFontSize(12);
        this.doc.setTextColor(this.textColor);
        this.doc.text(`Tutor: ${tutorName}`, 14, yPos);
        yPos += 10;

        autoTable(this.doc, {
            startY: yPos,
            head: [['Day', 'Time', 'Subject', 'Module', 'Students']],
            body: schedule.map(item => [
                item.day,
                item.time,
                item.subject,
                item.module,
                item.students,
            ]),
            theme: 'striped',
            headStyles: {
                fillColor: this.primaryColor,
                textColor: '#ffffff',
            },
            styles: {
                fontSize: 10,
            },
        });

        this.addFooter(1);
        this.doc.save(`${tutorName}_Schedule.pdf`);
    }

    // Export Student List with Details
    exportStudentList(
        className: string,
        students: Array<{
            name: string;
            email: string;
            grade: string;
            average: number;
            attendance: number;
        }>
    ): void {
        this.doc = new jsPDF();
        this.addHeader('Student List');

        let yPos = 45;
        this.doc.setFontSize(12);
        this.doc.setTextColor(this.textColor);
        this.doc.text(`Class: ${className}`, 14, yPos);
        yPos += 10;

        autoTable(this.doc, {
            startY: yPos,
            head: [['Name', 'Email', 'Grade', 'Average', 'Attendance']],
            body: students.map(student => [
                student.name,
                student.email,
                student.grade,
                `${student.average}%`,
                `${student.attendance}%`,
            ]),
            theme: 'striped',
            headStyles: {
                fillColor: this.primaryColor,
                textColor: '#ffffff',
            },
            styles: {
                fontSize: 9,
            },
        });

        this.addFooter(1);
        this.doc.save(`${className}_Students.pdf`);
    }

    // Export Monthly Analytics Report
    exportMonthlyReport(
        month: string,
        year: string,
        stats: {
            totalClasses: number;
            totalStudents: number;
            totalAssignments: number;
            averageAttendance: number;
            topPerformers: Array<{ name: string; average: number }>;
            subjectPerformance: Array<{ subject: string; average: number }>;
        }
    ): void {
        this.doc = new jsPDF();
        this.addHeader('Monthly Analytics Report');

        let yPos = 45;
        this.doc.setFontSize(12);
        this.doc.setTextColor(this.textColor);
        this.doc.text(`Period: ${month} ${year}`, 14, yPos);
        yPos += 10;

        // Summary Statistics
        this.doc.setFontSize(14);
        this.doc.setTextColor(this.primaryColor);
        this.doc.text('Summary Statistics', 14, yPos);
        yPos += 7;

        this.doc.setFontSize(11);
        this.doc.setTextColor(this.textColor);
        this.doc.text(`Total Classes: ${stats.totalClasses}`, 14, yPos);
        yPos += 7;
        this.doc.text(`Total Students: ${stats.totalStudents}`, 14, yPos);
        yPos += 7;
        this.doc.text(`Total Assignments: ${stats.totalAssignments}`, 14, yPos);
        yPos += 7;
        this.doc.text(`Average Attendance: ${stats.averageAttendance}%`, 14, yPos);
        yPos += 10;

        // Top Performers
        this.doc.setFontSize(14);
        this.doc.setTextColor(this.primaryColor);
        this.doc.text('Top Performers', 14, yPos);
        yPos += 7;

        autoTable(this.doc, {
            startY: yPos,
            head: [['Student Name', 'Average']],
            body: stats.topPerformers.map(student => [
                student.name,
                `${student.average}%`,
            ]),
            theme: 'striped',
            headStyles: {
                fillColor: this.primaryColor,
                textColor: '#ffffff',
            },
        });

        // Subject Performance
        const topPerformersEndY = (this.doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY || yPos + 30;
        this.doc.setFontSize(14);
        this.doc.setTextColor(this.primaryColor);
        this.doc.text('Subject Performance', 14, topPerformersEndY + 10);

        autoTable(this.doc, {
            startY: topPerformersEndY + 15,
            head: [['Subject', 'Class Average']],
            body: stats.subjectPerformance.map(subject => [
                subject.subject,
                `${subject.average}%`,
            ]),
            theme: 'striped',
            headStyles: {
                fillColor: this.primaryColor,
                textColor: '#ffffff',
            },
        });

        this.addFooter(1);
        this.doc.save(`Monthly_Report_${month}_${year}.pdf`);
    }
}

// Singleton instance
export const pdfExporter = new PDFExporter();

export default pdfExporter;
