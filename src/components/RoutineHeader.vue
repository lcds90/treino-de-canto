<template>
  <div ref="headerRef" class="text-center q-mb-xl q-mt-lg">
    <h1 class="text-h4 text-weight-bold text-primary q-mb-sm">🎧 Hora de Soltar a Voz! 🎶</h1>
    <p class="text-subtitle1">
      Siga as instruções de cada vídeo e marque os exercícios concluídos.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

const headerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!headerRef.value) return;
  // Animação de entrada autônoma
  gsap.from(headerRef.value, { y: -30, opacity: 0, duration: 0.8, ease: 'power3.out' });
});
</script>
