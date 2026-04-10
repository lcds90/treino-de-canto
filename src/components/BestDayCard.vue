<template>
  <div ref="cardRef" class="best-day-container flex flex-center column q-pa-md">
    <template v-if="bestDay">
      <div ref="iconRef" class="trophy-icon text-warning">🏆</div>
      <div class="text-h5 text-weight-bolder q-mt-sm text-capitalize">
        {{ formattedDate }}
      </div>
      <div class="text-subtitle2  q-mt-xs text-center">
        <span class="text-positive text-weight-bold">{{ bestDay.completed }} completos</span>
        <span v-if="bestDay.partial > 0">, {{ bestDay.partial }} parciais</span>
      </div>
    </template>

    <template v-else>
      <div ref="iconRef" class="trophy-icon" style="filter: grayscale(1); opacity: 0.5">🎯</div>
      <div class="text-h6 text-weight-bolder  q-mt-sm">Sem Recordes</div>
      <div class="text-caption  q-mt-xs text-center">
        Faça seu primeiro exercício completo hoje!
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import gsap from 'gsap';

const props = defineProps<{
  bestDay: { date: string; completed: number; partial: number } | null;
}>();

const cardRef = ref<HTMLElement | null>(null);
const iconRef = ref<HTMLElement | null>(null);

// Formata a data (Ex: "Segunda-feira, 12/04")
const formattedDate = computed(() => {
  if (!props.bestDay) return '';
  // O T12:00:00 blinda a data contra bugs de fuso horário na hora de formatar
  const d = new Date(`${props.bestDay.date}T12:00:00`);
  const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(d);
  const dayMonth = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(d);

  return `${weekday.split('-')[0]}, ${dayMonth}`; // Fica "Segunda, 10/04"
});

onMounted(() => {
  if (cardRef.value) {
    gsap.from(cardRef.value, {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.5)',
      delay: 0.1,
    });
  }

  // Faz o troféu dar um pulinho se houver recorde
  if (iconRef.value && props.bestDay) {
    gsap.from(iconRef.value, {
      y: 10,
      rotation: -10,
      duration: 0.6,
      ease: 'back.out(2)',
      delay: 0.5,
    });
  }
});
</script>

<style scoped>
.best-day-container {
  border-radius: 16px;
  /* Sombra amarela/dourada para dar clima de prêmio */
  box-shadow: 0 4px 15px rgba(242, 192, 55, 0.15);
  border: 1px solid rgba(242, 192, 55, 0.2);
}

.trophy-icon {
  font-size: 3.5rem;
  line-height: 1;
  text-shadow: 0 0 15px rgba(242, 192, 55, 0.4);
}
</style>
