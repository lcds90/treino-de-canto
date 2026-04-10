<template>
  <q-page class="q-pa-md">
    <div class="row justify-center q-mb-xl q-mt-lg">
      <div class="col-12 col-md-8 text-center" ref="heroRef">
        <h1 class="text-h3 text-weight-bolder text-primary q-mb-sm">
          {{ appTitle }}
        </h1>
        <p class="text-subtitle1">{{ appDescription }}</p>
        <theme-settings-button />
      </div>
    </div>

    <div class="row q-col-gutter-lg justify-center q-mb-xl max-width-container mx-auto">
      <div class="col-12 col-sm-4">
        <StreakCard :streak="currentStreak" class="q-mb-sm" />
        <best-day-card :best-day="bestDay" />
      </div>

      <div class="col-12 col-sm-8">
        <PerformanceChart :chartData="weeklyChartData" />
      </div>
    </div>

    <div class="row justify-center q-mb-xl">
      <q-btn
        ref="btnRef"
        color="secondary"
        text-color="white"
        size="xl"
        rounded
        unelevated
        class="study-btn shadow-4"
        @click="startStudy"
      >
        <span class="text-weight-bold text-h6">Começar Treino 🚀</span>
      </q-btn>
    </div>

    <div class="row justify-center max-width-container mx-auto" ref="historyRef">
      <div class="col-12">
        <WorkoutHistoryTable />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';
import { useWorkoutStore } from 'src/stores/workout-store';
import { useMetricsStore } from 'src/stores/metrics-store';

import StreakCard from 'src/components/StreakCard.vue';
import PerformanceChart from 'src/components/PerformanceChart.vue';
import WorkoutHistoryTable from 'src/components/WorkoutHistory.vue';
import BestDayCard from 'src/components/BestDayCard.vue';
import { useSettingsStore } from 'src/stores/settings-store';
import ThemeSettingsButton from 'src/components/ThemeSettings/ThemeSettingsButton.vue';

const $q = useQuasar();
const router = useRouter();

const workoutStore = useWorkoutStore();
const metricsStore = useMetricsStore();
const settingsStore = useSettingsStore();

const { bestDay, currentStreak, weeklyChartData } = storeToRefs(metricsStore);
const { appTitle, appDescription } = storeToRefs(settingsStore);

const heroRef = ref<HTMLElement | null>(null);
const btnRef = ref<any | null>(null);
const historyRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  // 1. Busca os treinos com segurança
  try {
    if (workoutStore.sessions.length === 0) {
      await workoutStore.fetchSessions();
    }
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
  }

  // 2. Aguarda um instante pro DOM renderizar, aí sim chama o GSAP
  setTimeout(() => {
    if (heroRef.value && btnRef.value && historyRef.value) {
      const tl = gsap.timeline();
      tl.from(heroRef.value, { y: -30, opacity: 0, duration: 0.8, ease: 'power3.out' })
        .from(btnRef.value.$el, { duration: 0.6, ease: 'back.out(1.5)' }, '-=0.4')
        .from(
          historyRef.value.$el || historyRef.value,
          { y: 30, opacity: 0, duration: 0.6 },
          '-=0.2',
        );

      gsap.to(btnRef.value.$el, {
        y: -5,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1,
      });
    }
  }, 100);
});

const startStudy = () => {
  if (!btnRef.value) return;
  const btnElement = btnRef.value.$el;

  gsap.to(btnElement, {
    scale: 0.9,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      void router.push('/treino');
      $q.notify({ type: 'positive', message: '🚀 Treino iniciado!' });
    },
  });
};
</script>

<style scoped>
.max-width-container {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.study-btn {
  padding: 12px 64px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.study-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2) !important;
}
</style>
