<template>
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
        class="text-weight-bold shadow-4 no-hover-effect"
      />

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
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import gsap from 'gsap';

const emit = defineEmits(['finish']);
const $q = useQuasar();

const backBtnRef = ref<any | null>(null);
const fabRef = ref<any | null>(null);

onMounted(() => {
  if (!backBtnRef.value || !fabRef.value) return;

  // Entrada inicial dos botões (junto com a página)
  gsap.from([backBtnRef.value.$el, fabRef.value.$el], {
    scale: 0,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'elastic.out(1, 0.7)',
    delay: 0.8 // Espera os cards entrarem
  });
});

const handleFinishClick = () => {
  if (!fabRef.value) return;
  const btnEl = fabRef.value.$el;

  // Animação de "pressionar"
  gsap.to(btnEl, {
    scale: 0.9,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      openDialog(btnEl);
    }
  });
};

const openDialog = (btnEl: HTMLElement) => {
  $q.dialog({
    title: 'Parabéns! 🎉',
    message: 'Você concluiu a rotina de hoje. Deseja finalizar e salvar seu progresso?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    // ANIMAÇÃO DE SUCESSO: Decolagem de foguete
    gsap.to(btnEl, {
      y: -100, // Dispara para cima
      scale: 0, // Encolhe
      opacity: 0,
      duration: 0.5,
      ease: 'back.in(1.5)',
      onComplete: () => {
        emit('finish'); // Chama a Store no pai
      }
    });
  }).onCancel(() => {
    // ANIMAÇÃO DE CANCELAMENTO: Balanço de negação
    gsap.fromTo(btnEl,
      { x: -5 },
      { x: 5, duration: 0.1, yoyo: true, repeat: 3, ease: 'sine.inOut', clearProps: "x" }
    );
  });
};
</script>

<style scoped>
.no-hover-effect:hover {
  background: transparent !important;
  opacity: 0.8;
}
</style>
