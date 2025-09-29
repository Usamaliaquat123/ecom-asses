'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatNumber } from '@/utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageOrderValue: number;
  growthRate: number;
}

interface CustomerChartProps {
  data: CustomerMetrics;
  height?: number;
}

export function CustomerChart({ data, height = 300 }: CustomerChartProps) {
  const chartData = {
    labels: ['New Customers', 'Returning Customers'],
    datasets: [
      {
        data: [data.newCustomers, data.returningCustomers],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Customer Distribution',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = data.newCustomers + data.returningCustomers;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${formatNumber(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(data.totalCustomers)}
            </div>
            <div className="text-gray-500">Total Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.growthRate > 0 ? '+' : ''}{data.growthRate.toFixed(1)}%
            </div>
            <div className="text-gray-500">Growth Rate</div>
          </div>
        </div>
      </div>
      <div style={{ height }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
