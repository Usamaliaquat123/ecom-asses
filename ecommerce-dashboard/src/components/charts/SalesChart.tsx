'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { formatCurrency, formatDate } from '@/utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SalesMetric {
  id: string;
  date: string;
  revenue: number;
  orders: number;
  customers: number;
  channel: string;
}

interface SalesChartProps {
  data: SalesMetric[];
  height?: number;
}

export function SalesChart({ data, height = 300 }: SalesChartProps) {
  const chartData = {
    labels: data.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Revenue',
        data: data.map(item => item.revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Sales Revenue Over Time',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Revenue: ${formatCurrency(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div style={{ height }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
