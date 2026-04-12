<template>
  <q-page-sticky position="bottom-right" :offset="[18, 18]" style="z-index: 100">
    <div class="row items-center q-gutter-md">

      <q-btn
        ref="backBtnRef"
        rounded
        color="white"
        text-color="primary"
        icon="arrow_back"
        label="Início"
        class="text-weight-bold shadow-4 no-hover-effect"
        @click="handleBackClick"
      />

      <q-btn
        v-if="todayWorkoutId && !isWorkoutActive"
        ref="historyBtnRef"
        fab-mini
        icon="history"
        color="info"
        class="shadow-5"
        :to="`/treino/${todayWorkoutId}`"
      >
        <q-tooltip>Ver treino concluído de hoje</q-tooltip>
      </q-btn>

      <transition
        appear
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
      >
        <q-chip
          v-if="isWorkoutActive"
          icon="timer"
          color="dark"
          text-color="white"
          size="lg"
          class="shadow-4 text-weight-bolder"
        >
          {{ formattedTime }}
        </q-chip>
      </transition>

      <q-btn
        ref="fabRef"
        fab
        :icon="isWorkoutActive ? 'check' : 'play_arrow'"
        :color="isWorkoutActive ? 'positive' : 'secondary'"
        :label="isWorkoutActive ? 'Finalizar Treino 🏆' : 'Começar Treino 🚀'"
        class="shadow-5 transition-transform"
        @click="handleMainActionClick"
      />

    </div>
  </q-page-sticky>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import gsap from 'gsap';
import { useRoutineStore } from 'src/stores/routine-store';
import { useWorkoutStore } from 'src/stores/workout-store';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['finish']);
const router = useRouter();
const $q = useQuasar();

const routineStore = useRoutineStore();
const workoutStore = useWorkoutStore();

const { tasks } = storeToRefs(routineStore);
const { isWorkoutActive, formattedTime, elapsedSeconds, startTime } = storeToRefs(workoutStore);

const todayWorkoutId = ref<string | null>(null);

const backBtnRef = ref<any | null>(null);
const fabRef = ref<any | null>(null);
const historyBtnRef = ref<any | null>(null);

onMounted(() => {
  if (!backBtnRef.value || !fabRef.value) return;

  const elementsToAnimate = [backBtnRef.value.$el, fabRef.value.$el];
  if (historyBtnRef.value) elementsToAnimate.splice(1, 0, historyBtnRef.value.$el);

  gsap.from(elementsToAnimate, {
    scale: 0,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'elastic.out(1, 0.7)',
    delay: 0.8,
    clearProps: 'all'
  });
});

// Removemos o onBeforeUnmount! Agora o timer vive na Store e sobrevive a trocas de página.

// --- CÁLCULO DE MÉTRICAS ---
const calculateMetrics = () => {
  let completed = 0;
  let partial = 0;
  let uncompleted = 0;

  tasks.value.forEach((task) => {
    const totalItems = task.checklist.length;
    if (totalItems === 0) {
      uncompleted++;
      return;
    }

    const doneItems = task.checklist.filter((item) => item.done).length;

    if (doneItems === totalItems) {
      completed++;
    } else if (doneItems > 0) {
      partial++;
    } else {
      uncompleted++;
    }
  });

  return { total: tasks.value.length, completed, partial, uncompleted };
};

// --- HANDLERS ---
const handleBackClick = () => {
  const metrics = calculateMetrics();
  const hasProgress = metrics.completed > 0 || metrics.partial > 0 || isWorkoutActive.value;

  if (hasProgress) {
    $q.dialog({
      title: 'Treino em Andamento 🏃‍♂️',
      message: 'O seu treino está rolando! Se voltar agora, seu progresso e o tempo não serão salvos. Deseja sair mesmo assim?',
      cancel: { label: 'Continuar Treinando', color: 'primary', flat: true },
      ok: { label: 'Sair sem salvar', color: 'negative', unelevated: true },
      persistent: true,
    }).onOk(() => {
      routineStore.resetAllChecklists();
      workoutStore.resetTimer(); // Zera o timer global
      void router.push('/');
    });
    return;
  }

  void router.push('/');
};

const handleMainActionClick = () => {
  if (!isWorkoutActive.value) {
    routineStore.resetAllChecklists();
    workoutStore.startTimer(); // Inicia o timer na Store

    if (fabRef.value) {
      gsap.from(fabRef.value.$el, { scale: 0.8, duration: 0.3, ease: 'back.out(2)', clearProps: 'all' });
    }
  } else {
    handleFinishClick();
  }
};

const handleFinishClick = () => {
  if (!fabRef.value) return;
  const btnEl = fabRef.value.$el;

  gsap.to(btnEl, {
    scale: 0.9,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    clearProps: 'all',
    onComplete: () => openFinishDialog(btnEl),
  });
};

const openFinishDialog = (btnEl: HTMLElement) => {
  const metrics = calculateMetrics();

  // Pausa o relógio na Store
  workoutStore.pauseTimer();

  const messageHtml = `
    <div class="text-center q-mt-sm">
      <div class="text-body1 q-mb-md">Aqui está o resumo do seu desempenho de hoje:</div>
      <div class="row justify-center q-gutter-sm">
        <div class="col-12"><q-chip color="dark" text-color="white" icon="timer" class="text-weight-bold"> Duração: ${formattedTime.value}</q-chip></div>
        <div class="col-12"><q-chip color="positive" text-color="white" icon="star" class="text-weight-bold"> ${metrics.completed} Exercícios Completos</q-chip></div>
        ${metrics.partial > 0 ? `<div class="col-12"><q-chip color="warning" text-color="white" icon="star_half" class="text-weight-bold"> ${metrics.partial} Exercícios Parciais</q-chip></div>` : ''}
      </div>
      <div class="text-caption q-mt-md">Deseja finalizar e gravar este treino no seu histórico?</div>
    </div>
  `;

  $q.dialog({
    title: '<div class="text-center text-h5">Treino Concluído! 🎉</div>',
    message: messageHtml,
    html: true,
    cancel: { label: 'Continuar Treino', color: 'grey-7', flat: true },
    ok: { label: 'Salvar no Histórico', color: 'positive', unelevated: true },
    persistent: true,
  })
    .onOk(() => {
      const endTime = new Date();

      gsap.to(btnEl, {
        rotate: 360,
        duration: 0.5,
        ease: 'back.in(1.5)',
        clearProps: 'all',
        onComplete: () => {
          emit('finish', {
            metrics,
            timing: {
              start: startTime.value,
              end: endTime,
              durationSeconds: elapsedSeconds.value
            },
            tasksSnapshot: JSON.parse(JSON.stringify(tasks.value)),
          });

          routineStore.resetAllChecklists();
          workoutStore.resetTimer(); // Zera o timer pós-salvamento
        },
      });
    })
    .onCancel(() => {
      // Retoma a contagem caso o usuário desista de finalizar
      workoutStore.resumeTimer();
      gsap.fromTo(btnEl, { x: -5 }, { x: 5, duration: 0.1, yoyo: true, repeat: 3, ease: 'sine.inOut', clearProps: 'x' });
    });
};
</script>

<style scoped>
.transition-transform {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
