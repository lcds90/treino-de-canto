<template>
  <q-card
    ref="addCardRef"
    class="routine-add-card flex flex-center cursor-pointer"
    flat
    @click="emit('click')"
  >
    <div class="text-center">
      <q-icon name="add_circle_outline" size="4rem" class="q-mb-sm" />
      <div class="text-h6 text-weight-bold">Adicionar Nova Rotina</div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

const emit = defineEmits(['click']);
const addCardRef = ref<any | null>(null);

onMounted(() => {
  if (!addCardRef.value) return;

  // Animação de "respiração" contínua para atrair a atenção
  gsap.to(addCardRef.value.$el, {
    scale: 1.02,
    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
});
</script>

<style scoped>
.routine-add-card {
  height: 100%;
  min-height: 250px;
  border: 3px dashed #e0e0e0;
  background-color: transparent;
  border-radius: 16px;
  transition:
    border-color 0.3s ease,
    color 0.3s ease;
}

.routine-add-card:hover {
  border-color: var(--q-primary);
  color: var(--q-primary) !important;
}
</style>
