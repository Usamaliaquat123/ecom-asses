<script setup lang="ts">
import { ref } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const chartData = ref({
  labels: ['Active Sessions', 'Idle Sessions', 'Offline Users'],
  datasets: [
    {
      data: [65, 25, 10],
      backgroundColor: [
        '#10b981',
        '#f59e0b',
        '#ef4444'
      ],
      borderColor: [
        '#059669',
        '#d97706',
        '#dc2626'
      ],
      borderWidth: 2,
      hoverOffset: 4
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
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
      callbacks: {
        label: function(context: any) {
          const label = context.label || '';
          const value = context.parsed;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  },
  cutout: '60%',
  elements: {
    arc: {
      borderWidth: 2,
    }
  }
})
</script>

<template>
  <div class="h-64 flex items-center justify-center">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
