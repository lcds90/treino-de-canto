<template>
  <q-page class="bg-grey-1 q-pa-md">
    <div ref="backBtnRef" class="q-mb-sm">
      <q-btn
        flat
        color="primary"
        icon="arrow_back"
        label="Voltar ao Início"
        to="/"
        class="text-weight-bold no-hover-effect"
      />
    </div>

    <div ref="headerRef" class="text-center q-mb-xl">
      <h1 class="text-h4 text-weight-bold text-primary q-mb-sm">🎧 Hora de Soltar a Voz! 🎶</h1>
      <p class="text-subtitle1 text-grey-7">
        Siga as instruções de cada vídeo e marque os exercícios concluídos.
      </p>
    </div>

    <div class="row q-col-gutter-lg justify-center">
      <div v-for="(task, index) in routineTasks" :key="task.id" class="col-12 col-md-8 col-lg-6">
        <RoutineCard :task="task" :ref="(el) => setCardRef(el, index)" />
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        ref="fabRef"
        fab
        icon="check"
        color="positive"
        label="Finalizar Treino 🏆"
        class="shadow-5"
        @click="finishRoutine"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';
// Importe o componente e a tipagem que criamos (ajuste o caminho conforme sua pasta)
import RoutineCard from 'src/components/RoutineCard.vue';
import { RoutineTask } from 'src/components/models';

const router = useRouter();

// --- DADOS ---
const routineTasks = ref<RoutineTask[]>([
  {
    id: '1',
    title: '1. Aquecimento Vocal Básico 🗣️',
    platform: 'youtube', // <-- Definido como YouTube
    mediaUrl: 'https://www.youtube.com/embed/a3Z7zEc7AXQ',
    instructions:
      'Antes de começarmos a forçar, assista ao vídeo e acompanhe os exercícios de respiração e vibração.',
    checklist: [{ id: 'c1', label: 'Lip Trill (Vibração de lábios)', done: false }],
  },
  {
    id: '2',
    title: '2. Belting Mastery - Aula 04 🚀',
    platform: 'hotmart', // <-- Definido como Hotmart
    mediaUrl: 'https://hotmart.com/pt-br/club', // Link para o curso
    instructions:
      'Faça login na plataforma e assista à aula de Belting. Volte aqui para marcar os checklists!',
    checklist: [
      { id: 'c2', label: 'Identificar a voz de peito', done: false },
      { id: 'c3', label: 'Exercício de transição vocal', done: false },
    ],
  },
  {
    id: '3',
    title: '3. Teoria Musical para Cantores 🎹',
    platform: 'udemy', // <-- Definido como Udemy
    mediaUrl: 'https://www.udemy.com/', // Link para o curso
    instructions: 'Assista a aula sobre leitura de partituras e formação de acordes básicos.',
    checklist: [{ id: 'c4', label: 'Reconhecer escala maior', done: false }],
  },
  {
    id: '4',
    title: '4. Prática de Agilidade Vocal 🎹',
    platform: 'yousician',
    mediaUrl: 'https://yousician.com/', // Link para abrir o site ou deep link do app
    instructions:
      'Abra o Yousician na seção de canto e complete o módulo de "Vocal Agility - Level 4". Mantenha o foco na precisão das notas!',
    checklist: [
      { id: 'c5', label: 'Completar lição com 3 estrelas ⭐', done: false },
      { id: 'c6', label: 'Praticar o modo "Work on it" nas partes difíceis', done: false },
    ],
  },
]);

// --- REFERÊNCIAS DO DOM (GSAP) ---
const backBtnRef = ref<HTMLElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);
const fabRef = ref<any | null>(null);

const cardsRefs = ref<HTMLElement[]>([]);

// O segredo para o GSAP funcionar com componentes Vue:
const setCardRef = (componentInstance: any, index: number) => {
  if (componentInstance) {
    // Quando usamos ref em um componente, recebemos a instância dele.
    // Precisamos do .$el para pegar a div raiz real que o GSAP consegue animar.
    cardsRefs.value[index] = componentInstance.$el;
  }
};

// --- ANIMAÇÕES E CICLO DE VIDA ---
onMounted(() => {
  if (!headerRef.value || !fabRef.value || !backBtnRef.value) return;

  const tl = gsap.timeline();

  tl.from(backBtnRef.value, { x: -20, opacity: 0, duration: 0.5, ease: 'power2.out' });
  tl.from(headerRef.value, { y: -30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3');

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

  tl.from(
    fabRef.value.$el,
    { scale: 0, opacity: 0, duration: 0.6, ease: 'elastic.out(1, 0.7)' },
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
