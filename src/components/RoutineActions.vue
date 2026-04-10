<template>
  <q-page-sticky position="bottom-right" :offset="[18, 18]" style="z-index: 100;">
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
        v-if="todayWorkoutId"
        ref="historyBtnRef"
        fab-mini
        icon="history"
        color="info"
        class="shadow-5"
        :to="`/treino/${todayWorkoutId}`"
      >
        <q-tooltip>Ver treino concluído de hoje</q-tooltip>
      </q-btn>

      <q-btn
        ref="fabRef"
        fab
        icon="check"
        color="positive"
        label="Finalizar Treino 🏆"
        class="shadow-5"
        @click="handleFinishClick"
      />

    </div>
  </q-page-sticky>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import gsap from 'gsap';
import { useRoutineStore } from 'src/stores/routine-store';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['finish']);
const router = useRouter();
const $q = useQuasar();

// Conecta com a Store para ler as tasks e calcular métricas
const routineStore = useRoutineStore();
const { tasks } = storeToRefs(routineStore);

// Simulação: ID do treino de hoje (Você vai puxar isso da sua Store depois)
const todayWorkoutId = ref<string | null>(null); // Ex: 'workout_123' se já treinou hoje

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
    delay: 0.8
  });
});

// --- CÁLCULO DE MÉTRICAS ---
const calculateMetrics = () => {
  let completed = 0;
  let partial = 0;
  let uncompleted = 0;

  tasks.value.forEach(task => {
    const totalItems = task.checklist.length;
    if (totalItems === 0) {
      uncompleted++;
      return;
    }

    const doneItems = task.checklist.filter(item => item.done).length;

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

// --- HANDLER: VOLTAR ---
const handleBackClick = () => {
  const metrics = calculateMetrics();
  const hasProgress = metrics.completed > 0 || metrics.partial > 0;

  if (hasProgress) {
    $q.dialog({
      title: 'Treino em Andamento 🏃‍♂️',
      message: 'Você tem exercícios marcados! Se voltar agora, seu treino não será salvo no histórico. Deseja sair mesmo assim?',
      cancel: { label: 'Continuar Treinando', color: 'primary', flat: true },
      ok: { label: 'Sair sem salvar', color: 'negative', unelevated: true },
      persistent: true,
    }).onOk(() => {
      router.push('/');
    });
  } else {
    router.push('/');
  }
};

// --- HANDLER: FINALIZAR ---
const handleFinishClick = () => {
  if (!fabRef.value) return;
  const btnEl = fabRef.value.$el;

  gsap.to(btnEl, {
    scale: 0.9,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => openFinishDialog(btnEl)
  });
};

const openFinishDialog = (btnEl: HTMLElement) => {
  const metrics = calculateMetrics();

  // Cria um HTML bonitinho para o Quasar Dialog
  const messageHtml = `
    <div class="text-center q-mt-sm">
      <div class="text-body1 q-mb-md text-grey-8">Aqui está o resumo do seu desempenho de hoje:</div>
      <div class="row justify-center q-gutter-sm">
        <div class="col-12"><q-chip color="positive" text-color="white" icon="star" class="text-weight-bold"> ${metrics.completed} Exercícios Completos</q-chip></div>
        ${metrics.partial > 0 ? `<div class="col-12"><q-chip color="warning" text-color="white" icon="star_half" class="text-weight-bold"> ${metrics.partial} Exercícios Parciais</q-chip></div>` : ''}
      </div>
      <div class="text-caption q-mt-md text-grey-6">Deseja finalizar e gravar este treino no seu histórico?</div>
    </div>
  `;

  $q.dialog({
    title: '<div class="text-center text-h5">Treino Concluído! 🎉</div>',
    message: messageHtml,
    html: true,
    cancel: { label: 'Revisar', color: 'grey-7', flat: true },
    ok: { label: 'Salvar no Histórico', color: 'positive', unelevated: true },
    persistent: true,
  }).onOk(() => {
    gsap.to(btnEl, {
      rotate: 360, duration: 0.5, ease: 'back.in(1.5)',
      onComplete: () => {
        emit('finish', {
          metrics,
          tasksSnapshot: JSON.parse(JSON.stringify(tasks.value))
        });
      }
    });
  }).onCancel(() => {
    gsap.fromTo(btnEl, { x: -5 }, { x: 5, duration: 0.1, yoyo: true, repeat: 3, ease: 'sine.inOut', clearProps: "x" });
  });
};
</script>
