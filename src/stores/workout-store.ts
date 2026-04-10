// src/stores/workout-store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { WorkoutSession } from 'src/components/models';
import { workoutService } from 'src/services';
import { useQuasar } from 'quasar';

const getLocalDateString = (isoString: string | Date) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useWorkoutStore = defineStore('workout', () => {
  const sessions = ref<WorkoutSession[]>([]);
  const isLoading = ref(false);
  const $q = useQuasar();

  // --- GETTERS ---
  const hasTrainedToday = computed(() => {
    const today = getLocalDateString(new Date());
    return sessions.value.some(session => getLocalDateString(session.date) === today);
  });

  const todayWorkoutSession = computed(() => {
    const today = getLocalDateString(new Date());
    return sessions.value.find(session => getLocalDateString(session.date) === today);
  });

  // --- ACTIONS ---
  const fetchSessions = async () => {
    isLoading.value = true;
    try {
      sessions.value = await workoutService.getAll();
    } catch (error) {
      console.error('Erro ao buscar histórico de treinos:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const saveWorkoutSessionAction = async (workoutData: WorkoutSession) => {
    isLoading.value = true;
    try {
      const savedSession = await workoutService.create(workoutData);
      sessions.value.push(savedSession);
      $q.notify({ type: 'positive', message: 'Treino salvo com sucesso! 🏆' });
    } catch (error) {
      console.error('Erro ao salvar o treino:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    sessions,
    isLoading,
    hasTrainedToday,
    todayWorkoutSession,
    fetchSessions,
    saveWorkoutSessionAction
  };
});
