<template>
  <q-card
    ref="libraryCardRef"
    class="routine-library-card flex flex-center cursor-pointer"
    flat
    @click="emit('click')"
  >
    <div class="text-center">
      <q-icon name="library_books" size="4rem" class="q-mb-sm text-secondary" />
      <div class="text-h6 text-weight-bold">Explorar Biblioteca</div>
      <div class="text-caption text-grey-6">Lições padrões e exercícios prontos</div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

const emit = defineEmits(['click']);
const libraryCardRef = ref<any | null>(null);

onMounted(() => {
  if (!libraryCardRef.value) return;

  // Animação de respiração contínua com delay para criar ritmo visual com o card de adicionar
  gsap.to(libraryCardRef.value.$el, {
    scale: 1.02,
    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.08)',
    duration: 1.6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 0.4
  });
});
</script>

<style scoped>
.routine-library-card {
  height: 100%;
  min-height: 250px;
  border: 3px dashed #dcdcdc;
  background-color: transparent;
  border-radius: 16px;
  transition:
    border-color 0.3s ease,
    color 0.3s ease,
    background-color 0.3s ease;
}

.routine-library-card:hover {
  border-color: var(--q-secondary);
  color: var(--q-secondary) !important;
  background-color: rgba(38, 166, 154, 0.03); /* Leve toque do secondary do Quasar */
}
</style>
