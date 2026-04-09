<template>
  <q-page class="flex flex-center column bg-grey-1 text-center q-pa-md">
    <div class="hero-container">

      <h1 ref="titleRef" class="animated-title text-h3 text-weight-bolder q-mb-md">
        Rotina de canto 🎤
      </h1>

      <div ref="subtitleRef" class="animated-subtitle text-grey-8 q-mb-xl">
        <p class="text-subtitle1 text-weight-medium">🔥 Ofensiva atual: 12 dias! ✨</p>
        <p class="text-subtitle2 text-weight-light">⭐ Você está no ritmo perfeito!</p>
      </div>

      <q-btn
        ref="btnRef"
        color="secondary"
        text-color="white"
        size="xl"
        rounded
        unelevated
        class="study-btn shadow-4"
        @click="startStudy"
      >
        <span class="text-weight-bold text-h6">Estudar</span>
      </q-btn>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

// Tipando as referências. Elementos HTML nativos usam HTMLElement.
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

// Como q-btn é um componente do Quasar, usamos 'any' ou tipamos a instância para acessar o $el sem erros.
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
const btnRef = ref<any | null>(null)

onMounted(() => {
  // Guard Clause: Garante para o TypeScript que nada aqui é 'null' a partir desta linha
  if (!titleRef.value || !subtitleRef.value || !btnRef.value) return

  // Armazenamos o elemento HTML do botão em uma constante para o GSAP
  const btnElement = btnRef.value.$el

  // 1. Timeline de entrada
  const tl = gsap.timeline()

  tl.from(titleRef.value, {
    y: -30,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)'
  })
  .from(subtitleRef.value, {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.4')
  .from(btnElement, {
    scale: 0,
    opacity: 0,
    duration: 0.8,
    ease: 'elastic.out(1, 0.5)'
  }, '-=0.2')

  // 2. Animação contínua (flutuação encantadora) no botão
  gsap.to(btnElement, {
    y: -8,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 1.5
  })
})

const startStudy = () => {
  // Nova verificação de nullidade para o evento de clique
  if (!btnRef.value) return

  const btnElement = btnRef.value.$el

  // Animação de "click" pressionado antes de navegar
  gsap.to(btnElement, {
    scale: 0.9,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      // Redireciona para a rota onde os vídeos do YouTube estarão
      void router.push('/rotina')
      $q.notify({
        type: 'positive',
        message: '🎧 Prepare as cordas vocais...',
      })
    }
  })
}
</script>

<style scoped>
.hero-container {
  max-width: 600px;
  width: 100%;
  background: linear-gradient(135deg, #d6d6d6, #ffffff);
  border-radius: 16px;
  padding: 40px 30px;
  box-shadow: 0 10px 5px rgba(20, 20, 20, 0.2);
}

/* Animação para o título */
@keyframes pulsate {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
  100% { transform: scale(1); opacity: 1; }
}

.animated-title {
  animation: pulsate 2s infinite ease-in-out;
}

/* Animação para o subtítulo */
@keyframes glowGradient {
  0% { color: #555; }
  50% { color: #f57c00; }
  100% { color: #555; }
}

.animated-subtitle {
  animation: glowGradient 3s infinite ease-in-out;
}

.study-btn {
  padding: 12px 48px;
  transition: filter 0.3s ease;
  position: relative;
}

.study-btn:hover {
  filter: brightness(1.1);
}

/* Foguete visual no botão */
.study-btn::after {
  content: '🚀';
  position: absolute;
  font-size: 1.5rem;
  right: 15px;
  top: 50%;
  transform: translateY(-50%) scale(0);
  transition: transform 0.3s ease, right 0.3s ease;
  opacity: 0;
}

.study-btn:hover::after {
  transform: translateY(-50%) scale(1.2) rotate(-15deg);
  right: 10px;
  opacity: 1;
}
</style>
