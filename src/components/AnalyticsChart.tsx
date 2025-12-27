'use client';

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    type ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface AnalyticsChartProps {
    data: {
        labels: string[];
        values: number[];
    };
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Расходы (сом)',
                data: data.values,
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
                borderColor: '#6366f1',
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: 'rgba(99, 102, 241, 0.8)',
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(15, 15, 18, 0.9)',
                padding: 12,
                titleColor: '#fff',
                bodyColor: '#a5b4fc',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
            },
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: '#64748b',
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#64748b',
                },
            },
        },
    };

    return (
        <div className="h-[300px] w-full">
            <Bar data={chartData} options={options} />
        </div>
    );
}
