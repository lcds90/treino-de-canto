import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useWorkoutStore } from './workout-store';
import { metricsService } from 'src/services/firebase/MetricsService';

export const useMetricsStore = defineStore('metrics', () => {
  const workoutStore = useWorkoutStore();

  // Computa a ofensiva baseada nos treinos salvos
  const currentStreak = computed(() => {
    return metricsService.calculateStreak(workoutStore.sessions);
  });

  // Computa os dados semanais para o Gráfico
  const weeklyChartData = computed(() => {
    return metricsService.getWeeklyPerformance(workoutStore.sessions);
  });

  const bestDay = computed(() => {
    return metricsService.getBestPerformanceDay(workoutStore.sessions);
  });

  return {
    bestDay,
    currentStreak,
    weeklyChartData
  };
});
