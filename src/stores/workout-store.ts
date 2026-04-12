// src/stores/workout-store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { WorkoutSession } from 'src/components/models';
import { workoutService } from 'src/services';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { useRoutineStore } from './routine-store';

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
  const route = useRoute();
  const routineStore = useRoutineStore();

  // --- GETTERS ---
  const hasTrainedToday = computed(() => {
    const today = getLocalDateString(new Date());
    return sessions.value.some((session) => getLocalDateString(session.date) === today);
  });

  const getSessionById = computed<WorkoutSession | undefined>(() =>
    sessions.value.find((session) => session.id === route.params.id),
  );

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
      routineStore.resetAllChecklists();
      $q.notify({ type: 'positive', message: 'Treino salvo com sucesso! 🏆' });
    } catch (error) {
      console.error('Erro ao salvar o treino:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const removeSessionAction = async (id: string) => {
    isLoading.value = true;
    try {
      await workoutService.delete(id);
      // Remove da memória local
      sessions.value = sessions.value.filter((session) => session.id !== id);
    } catch (error) {
      console.error('Erro ao deletar o treino:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // --- ESTADOS DO TIMER (GLOBAL) ---
  const isWorkoutActive = ref(false);
  const elapsedSeconds = ref(0);
  const startTime = ref<Date | null>(null);
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  // --- GETTER DO TIMER ---
  const formattedTime = computed(() => {
    const m = Math.floor(elapsedSeconds.value / 60).toString().padStart(2, '0');
    const s = (elapsedSeconds.value % 60).toString().padStart(2, '0');
    const h = Math.floor(elapsedSeconds.value / 3600);

    if (h > 0) return `${h.toString().padStart(2, '0')}:${m}:${s}`;
    return `${m}:${s}`;
  });

  // --- ACTIONS DO TIMER ---
  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    isWorkoutActive.value = true;
    startTime.value = new Date();
    elapsedSeconds.value = 0;

    timerInterval = setInterval(() => {
      elapsedSeconds.value++;
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
  };

  const resumeTimer = () => {
    if (timerInterval) clearInterval(timerInterval); // Previne duplicidade
    timerInterval = setInterval(() => {
      elapsedSeconds.value++;
    }, 1000);
  };

  const resetTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    isWorkoutActive.value = false;
    elapsedSeconds.value = 0;
    startTime.value = null;
  };

  return {
    sessions,
    isLoading,
    hasTrainedToday,
    getSessionById,
    fetchSessions,
    saveWorkoutSessionAction,
    removeSessionAction,
    // Timer
    isWorkoutActive,
    elapsedSeconds,
    formattedTime,
    startTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
  };
});
