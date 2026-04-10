<template>
  <div class="chart-card bg-white q-pa-md shadow-2">
    <div class="text-subtitle1 text-weight-bold text-grey-8 q-mb-sm">
      Desempenho Semanal (Exercícios)
    </div>

    <VueApexCharts
      v-if="hasValidData"
      type="bar"
      height="250"
      :options="chartOptions"
      :series="series"
    />

    <div v-else class="row flex-center" style="height: 250px;">
      <q-spinner-dots color="primary" size="2em" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

// Tipagem das props que vêm da sua MetricsStore
const props = defineProps<{
  chartData: {
    labels: string[],
    completed: number[],
    partial: number[],
    uncompleted: number[]
  }
}>();

// --- 1. SÉRIES DE DADOS ---
const hasValidData = computed(() => {
  return props.chartData &&
         props.chartData.completed &&
         props.chartData.completed.length > 0;
});

const series = computed(() => [
  {
    name: 'Completos',
    data: props.chartData?.completed || [] // Opcional chaining (?) garante que não vai quebrar
  },
  {
    name: 'Parciais',
    data: props.chartData?.partial || []
  },
  {
    name: 'Não Feitos',
    data: props.chartData?.uncompleted || []
  }
]);

// --- 2. CONFIGURAÇÕES DO GRÁFICO ---
const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      dynamicAnimation: { enabled: true, speed: 350 }
    }
  },
  // 🔴 AQUI ESTÁ A CORREÇÃO!
  // A ordem das cores segue EXATAMENTE a ordem do array "series" (Completos, Parciais, Não Feitos)
  colors: [
    '#21BA45', // 1. Verde (positive do Quasar) para Completos
    '#F2C037', // 2. Amarelo (warning do Quasar) para Parciais
    '#E0E0E0'  // 3. Cinza (grey-4 do Quasar) para Não Feitos
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 4,
      columnWidth: '40%',
    },
  },
  dataLabels: { enabled: false },
  stroke: { width: 0 },
  xaxis: {
    categories: props.chartData?.labels || [],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        colors: '#9e9e9e',
        fontWeight: 500,
      }
    }
  },
  yaxis: { show: false },
  grid: {
    show: false,
    padding: { top: 0, bottom: 0, left: 10, right: 10 }
  },
  legend: {
    position: 'bottom',
    markers: { radius: 12 },
    itemMargin: { horizontal: 10, vertical: 10 }
  },
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'light',
    y: {
      formatter: function (val: number) {
        return val + " exercícios";
      }
    }
  }
}));
</script>

<style scoped>
.chart-card {
  border-radius: 16px;
}

/* Garante que o ApexCharts respeite o arredondamento do card pai */
:deep(.apexcharts-tooltip) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: none;
}
</style>
