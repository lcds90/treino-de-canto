<template>
  <div class="chart-card q-pa-md shadow-2">
    <div class="text-subtitle1 text-weight-bold q-mb-sm">Desempenho Semanal (Exercícios)</div>

    <VueApexCharts
      v-if="hasValidData"
      ref="chart"
      type="bar"
      height="250"
      :options="chartOptions"
      :series="series"
    />

    <div v-else class="row flex-center" style="height: 250px">
      <q-spinner-dots color="primary" size="2em" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import VueApexCharts, { VueApexChartsComponentProps } from 'vue3-apexcharts';
import { useQuasar } from 'quasar'; // <-- Importe o Quasar aqui

const $q = useQuasar(); // <-- Inicialize
const chart = ref<any>(null);
const props = defineProps<{
  chartData: {
    labels: string[];
    completed: number[];
    partial: number[];
    uncompleted: number[];
  };
}>();

const hasValidData = computed(() => {
  return props.chartData && props.chartData.completed && props.chartData.completed.length > 0;
});

const series = computed(() => [
  { name: 'Completos', data: props.chartData?.completed || [] },
  { name: 'Parciais', data: props.chartData?.partial || [] },
  { name: 'Não Feitos', data: props.chartData?.uncompleted || [] },
]);

const chartOptions = computed<ApexCharts.ApexOptions>(() => ({
  theme: {
    mode: $q.dark.isActive ? 'dark' : 'light',
  },
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false },
    foreColor: $q.dark.isActive ? '#bdbdbd' : '#333333',
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      dynamicAnimation: { enabled: true, speed: 350 },
    },
    // Fundo transparente para herdar o background do Card
    background: 'transparent',
  },
  colors: [
    '#21BA45', // Completos
    '#F2C037', // Parciais
    // 🔴 3. Deixa a barra "Não Feito" com um cinza mais escuro no Dark Mode para não ofuscar
    $q.dark.isActive ? '#424242' : '#E0E0E0',
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
  },
  yaxis: { show: false },
  grid: {
    show: false,
    padding: { top: 0, bottom: 0, left: 10, right: 10 },
  },
  legend: {
    position: 'bottom',
    markers: { size: 6 },
    itemMargin: { horizontal: 10, vertical: 10 },
  },
  tooltip: {
    shared: true,
    intersect: false,
    // 🔴 4. Tooltip reativo!
    theme: $q.dark.isActive ? 'dark' : 'light',
    y: {
      formatter: function (val: number) {
        return val + ' exercícios';
      },
    },
  },
}));

watch(
  () => $q.dark.isActive,
  () => {
    if (hasValidData.value && chart.value) {
      console.log(chart.value);
      chart.value.refresh();
    }
  },
);
</script>

<style scoped>
.chart-card {
  border-radius: 16px;
}

/* Garante que o ApexCharts respeite o arredondamento do card pai */
:deep(.apexcharts-tooltip) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
}
</style>
