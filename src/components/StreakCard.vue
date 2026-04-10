<template>
  <div ref="cardRef" class="streak-container flex flex-center column q-pa-md">
    <div ref="fireRef" class="fire-icon text-orange-8">
      🔥
    </div>

    <div class="text-h4 text-weight-bolder text-grey-9 q-mt-sm">
      {{ streak }} <span class="text-h6 text-weight-medium">Dias Seguidos!</span>
    </div>

    <div class="text-subtitle2 text-grey-6 q-mt-xs text-center">
      {{ motivationalMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import gsap from 'gsap';

const props = defineProps<{ streak: number }>();

const fireRef = ref<HTMLElement | null>(null);
const cardRef = ref<HTMLElement | null>(null);

const motivationalMessage = computed(() => {
  if (props.streak === 0) return "Hoje é um ótimo dia para começar!";
  if (props.streak < 3) return "Bom começo! Mantenha o ritmo.";
  if (props.streak < 7) return "Você está pegando fogo! 🔥";
  return "Incrível! Hábitos criados com sucesso! 🚀";
});

onMounted(() => {
  if (!fireRef.value || !cardRef.value) return;

  // Entrada do Card
  gsap.from(cardRef.value, {
    scale: 0.8, opacity: 0, duration: 0.8, ease: 'back.out(1.5)'
  });

  // Animação contínua da chama
  gsap.to(fireRef.value, {
    scale: 1.15,
    rotation: 5,
    duration: 0.4,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });
});

// Se a streak atualizar (ex: usuário salva um treino e volta pra home)
watch(() => props.streak, (newVal, oldVal) => {
  if (newVal > oldVal && fireRef.value) {
    // "Explosão" comemorativa do fogo
    gsap.fromTo(fireRef.value,
      { scale: 1 },
      { scale: 1.8, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' }
    );
  }
});
</script>

<style scoped>
.streak-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.15); /* Sombra laranjinha */
  border: 1px solid rgba(255, 152, 0, 0.1);
}

.fire-icon {
  font-size: 4rem;
  line-height: 1;
  text-shadow: 0 0 20px rgba(255, 152, 0, 0.4);
}
</style>
