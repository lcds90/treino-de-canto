<template>
  <q-page class="bg-grey-1 q-pa-md">

    <div ref="headerRef" class="text-center q-mb-xl q-mt-lg">
      <h1 class="text-h4 text-weight-bold text-primary q-mb-sm">🎧 Hora de Soltar a Voz! 🎶</h1>
      <p class="text-subtitle1 text-grey-7">
        Siga as instruções de cada vídeo e marque os exercícios concluídos.
      </p>
    </div>

    <div class="row q-col-gutter-lg justify-center">
      <div
        v-for="(task, index) in routineTasks"
        :key="task.id"
        class="col-12 col-md-8 col-lg-6 q-mb-lg"
      >
        <RoutineCard :task="task" :ref="(el) => setCardRef(el, index)" />
      </div>
    </div>

    <div style="height: 100px; width: 100%;"></div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <div class="row items-center q-gutter-md">

        <q-btn
          ref="backBtnRef"
          rounded
          color="white"
          text-color="primary"
          icon="arrow_back"
          label="Início"
          to="/"
          class="text-weight-bold shadow-4"
        />

        <q-btn
          ref="fabRef"
          fab
          icon="check"
          color="positive"
          label="Finalizar Treino 🏆"
          class="shadow-5"
          @click="finishRoutine"
        />

      </div>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';
import RoutineCard from 'src/components/RoutineCard.vue';
import { RoutineTask } from 'src/components/models'; // Ajuste se o tipo estiver exportado no próprio RoutineCard

const router = useRouter();

// --- DADOS ---
const routineTasks = ref<RoutineTask[]>([
  {
    id: '1',
    title: '1. Aquecimento Vocal Básico 🗣️',
    platform: 'youtube',
    mediaUrl: 'https://www.youtube.com/embed/a3Z7zEc7AXQ',
    instructions: 'Antes de começarmos a forçar, assista ao vídeo e acompanhe os exercícios de respiração e vibração.',
    checklist: [{ id: 'c1', label: 'Lip Trill (Vibração de lábios)', done: false }],
  },
  {
    id: '2',
    title: '2. Belting Mastery - Aula 04 🚀',
    platform: 'hotmart',
    mediaUrl: 'https://hotmart.com/pt-br/club',
    instructions: 'Faça login na plataforma e assista à aula de Belting. Volte aqui para marcar os checklists!',
    checklist: [
      { id: 'c2', label: 'Identificar a voz de peito', done: false },
      { id: 'c3', label: 'Exercício de transição vocal', done: false },
    ],
  },
  {
    id: '3',
    title: '3. Teoria Musical para Cantores 🎹',
    platform: 'udemy',
    mediaUrl: 'https://www.udemy.com/',
    instructions: 'Assista a aula sobre leitura de partituras e formação de acordes básicos.',
    checklist: [{ id: 'c4', label: 'Reconhecer escala maior', done: false }],
  },
  {
    id: '4',
    title: '4. Prática de Agilidade Vocal 🎹',
    platform: 'yousician',
    mediaUrl: 'https://yousician.com/',
    instructions: 'Abra o Yousician na seção de canto e complete o módulo de "Vocal Agility - Level 4". Mantenha o foco na precisão das notas!',
    checklist: [
      { id: 'c5', label: 'Completar lição com 3 estrelas ⭐', done: false },
      { id: 'c6', label: 'Praticar o modo "Work on it" nas partes difíceis', done: false },
    ],
  },
]);

// --- REFERÊNCIAS DO DOM (GSAP) ---
const headerRef = ref<HTMLElement | null>(null);

// IMPORTANTE: Agora o backBtnRef é referenciado em um componente do Quasar (q-btn),
// então tipamos como 'any' para poder acessar o .$el assim como o fabRef.
const backBtnRef = ref<any | null>(null);
const fabRef = ref<any | null>(null);

const cardsRefs = ref<HTMLElement[]>([]);

const setCardRef = (componentInstance: any, index: number) => {
  if (componentInstance) {
    cardsRefs.value[index] = componentInstance.$el;
  }
};

// --- ANIMAÇÕES E CICLO DE VIDA ---
onMounted(() => {
  if (!headerRef.value || !fabRef.value || !backBtnRef.value) return;

  const tl = gsap.timeline();

  // 1. Título desce primeiro
  tl.from(headerRef.value, { y: -30, opacity: 0, duration: 0.8, ease: 'power3.out' });

  // 2. Cartões entram
  if (cardsRefs.value.length > 0) {
    tl.from(
      cardsRefs.value,
      {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'back.out(1.2)',
      },
      '-=0.4',
    );
  }

  // 3. Os DOIS botões flutuantes aparecem juntos, um levemente após o outro (stagger)
  tl.from(
    [backBtnRef.value.$el, fabRef.value.$el],
    {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15, // Atraso de 0.15s entre o botão de Voltar e o de Finalizar
      ease: 'elastic.out(1, 0.7)'
    },
    '-=0.2',
  );
});

// --- MÉTODOS ---
const finishRoutine = () => {
  if (!fabRef.value) return;

  gsap.to(fabRef.value.$el, {
    scale: 1.1,
    duration: 0.15,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      console.log('🎉 Treino finalizado! Salvando no Firestore...');
    },
  });
};
</script>

<style scoped>
.no-hover-effect:hover {
  background: transparent !important;
  opacity: 0.8;
}
</style>
