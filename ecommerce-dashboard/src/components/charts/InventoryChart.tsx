'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatNumber } from '@/utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  reserved: number;
  price: number;
  cost: number;
  supplier?: string;
  lastUpdated: string;
}

interface InventoryChartProps {
  data: InventoryItem[];
  height?: number;
}

export function InventoryChart({ data, height = 300 }: InventoryChartProps) {
  // Group by category and sum stock levels
  const categoryData = data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { stock: 0, reserved: 0, items: 0 };
    }
    acc[item.category].stock += item.stock;
    acc[item.category].reserved += item.reserved;
    acc[item.category].items += 1;
    return acc;
  }, {} as Record<string, { stock: number; reserved: number; items: number }>);

  const categories = Object.keys(categoryData);
  const stockData = categories.map(cat => categoryData[cat].stock);
  const reservedData = categories.map(cat => categoryData[cat].reserved);

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Available Stock',
        data: stockData,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Reserved Stock',
        data: reservedData,
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 1,
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
        text: 'Inventory Levels by Category',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatNumber(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
        ticks: {
          callback: function(value: any) {
            return formatNumber(value);
          },
        },
      },
      x: {
        stacked: true,
      },
    },
  };

  // Calculate low stock items
  const lowStockItems = data.filter(item => item.stock < 10).length;
  const totalItems = data.length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(totalItems)}
            </div>
            <div className="text-gray-500">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(totalItems - lowStockItems)}
            </div>
            <div className="text-gray-500">In Stock</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {formatNumber(lowStockItems)}
            </div>
            <div className="text-gray-500">Low Stock</div>
          </div>
        </div>
      </div>
      <div style={{ height }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
