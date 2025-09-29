<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const chartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Total Users',
      data: [12, 19, 25, 32, 45, 52, 68, 75, 88, 95, 102, 115],
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#8b5cf6',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    },
    {
      label: 'Active Users',
      data: [8, 15, 20, 28, 38, 45, 58, 65, 75, 82, 88, 95],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: '500'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#374151',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      mode: 'index' as const,
      intersect: false,
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 11
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#f3f4f6',
        borderDash: [2, 2],
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 11
        }
      }
    }
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  elements: {
    point: {
      hoverRadius: 8,
    }
  }
})
</script>

<template>
  <div class="h-64">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
