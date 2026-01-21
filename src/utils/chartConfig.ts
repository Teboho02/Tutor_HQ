/**
 * Chart Configuration Utilities
 * Reusable configurations for Chart.js charts across the application
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Color palette
export const colors = {
  primary: '#0066ff',
  secondary: '#4285f4',
  success: '#34a853',
  warning: '#f9ab00',
  danger: '#ea4335',
  info: '#00acc1',
  purple: '#9c27b0',
  orange: '#ff9800',
  gray: '#9e9e9e',
};

// Default chart options
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 12,
        },
        padding: 15,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
      },
      bodyFont: {
        size: 13,
      },
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
};

// Line Chart Configuration
export function createLineChartConfig(
  labels: string[],
  datasets: Array<{
    label: string;
    data: number[];
    color?: string;
  }>
) {
  return {
    type: 'line' as const,
    data: {
      labels,
      datasets: datasets.map((dataset, index) => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: dataset.color || Object.values(colors)[index],
        backgroundColor: `${dataset.color || Object.values(colors)[index]}33`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      })),
    },
    options: {
      ...defaultChartOptions,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  };
}

// Bar Chart Configuration
export function createBarChartConfig(
  labels: string[],
  datasets: Array<{
    label: string;
    data: number[];
    color?: string;
  }>
) {
  return {
    type: 'bar' as const,
    data: {
      labels,
      datasets: datasets.map((dataset, index) => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: dataset.color || Object.values(colors)[index],
        borderColor: dataset.color || Object.values(colors)[index],
        borderWidth: 1,
        borderRadius: 4,
      })),
    },
    options: {
      ...defaultChartOptions,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  };
}

// Pie/Doughnut Chart Configuration
export function createPieChartConfig(
  labels: string[],
  data: number[],
  chartColors?: string[]
) {
  const backgroundColors = chartColors || [
    colors.primary,
    colors.secondary,
    colors.success,
    colors.warning,
    colors.danger,
    colors.info,
    colors.purple,
    colors.orange,
  ];

  return {
    type: 'pie' as const,
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    },
    options: {
      ...defaultChartOptions,
      plugins: {
        ...defaultChartOptions.plugins,
        legend: {
          ...defaultChartOptions.plugins.legend,
          position: 'right' as const,
        },
      },
    },
  };
}

// Progress Chart (for student progress over time)
export function createProgressChartConfig(
  months: string[],
  averages: number[]
) {
  return createLineChartConfig(
    months,
    [
      {
        label: 'Average Score',
        data: averages,
        color: colors.primary,
      },
    ]
  );
}

// Subject Performance Chart
export function createSubjectPerformanceChart(
  subjects: string[],
  scores: number[]
) {
  return createBarChartConfig(
    subjects,
    [
      {
        label: 'Average Score',
        data: scores,
        color: colors.secondary,
      },
    ]
  );
}

// Attendance Chart
export function createAttendanceChart(
  weeks: string[],
  attendanceRates: number[]
) {
  return createLineChartConfig(
    weeks,
    [
      {
        label: 'Attendance Rate (%)',
        data: attendanceRates,
        color: colors.success,
      },
    ]
  );
}

// Multi-Student Comparison Chart
export function createStudentComparisonChart(
  subjects: string[],
  students: Array<{
    name: string;
    scores: number[];
  }>
) {
  return createBarChartConfig(
    subjects,
    students.map((student, index) => ({
      label: student.name,
      data: student.scores,
      color: Object.values(colors)[index % Object.values(colors).length],
    }))
  );
}

// Grade Distribution Chart
export function createGradeDistributionChart(grades: {
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
}) {
  return createPieChartConfig(
    ['A', 'B', 'C', 'D', 'F'],
    [grades.A, grades.B, grades.C, grades.D, grades.F],
    [colors.success, colors.info, colors.warning, colors.orange, colors.danger]
  );
}

// Test Performance Over Time
export function createTestPerformanceChart(
  testNames: string[],
  scores: number[]
) {
  return {
    type: 'line' as const,
    data: {
      labels: testNames,
      datasets: [
        {
          label: 'Test Scores',
          data: scores,
          borderColor: colors.primary,
          backgroundColor: `${colors.primary}33`,
          borderWidth: 3,
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: colors.primary,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      ...defaultChartOptions,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
          ticks: {
            callback: (value: number) => `${value}%`,
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  };
}

// Class Schedule Heatmap Data (for use with custom heatmap component)
export function createScheduleHeatmapData(
  schedule: Array<{
    day: string;
    hour: number;
    classes: number;
  }>
) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM

  const heatmapData = days.map((day) => {
    return hours.map((hour) => {
      const entry = schedule.find((s) => s.day === day && s.hour === hour);
      return entry ? entry.classes : 0;
    });
  });

  return {
    days,
    hours: hours.map((h) => `${h}:00`),
    data: heatmapData,
  };
}

export default {
  colors,
  defaultChartOptions,
  createLineChartConfig,
  createBarChartConfig,
  createPieChartConfig,
  createProgressChartConfig,
  createSubjectPerformanceChart,
  createAttendanceChart,
  createStudentComparisonChart,
  createGradeDistributionChart,
  createTestPerformanceChart,
  createScheduleHeatmapData,
};
