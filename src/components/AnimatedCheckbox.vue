<template>
  <div class="animated-checkbox-wrapper" @click="toggleChecked">
    <div class="checkbox-container">
      <svg
        ref="mainSvgRef"
        class="animated-checkbox-svg"
        width="24" height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          ref="boxRef"
          class="checkbox-box"
          x="2" y="2" width="20" height="20"
          :class="{ 'checkbox-box-checked': isCheckedInternal }"
        />
        <path
          ref="checkRef"
          class="checkmark-path"
          d="M 5 12 L 10 17 L 19 8"
        />

        <g ref="particlesGroupRef" class="checkbox-particles">
          <circle v-for="i in 10" :key="`c${i}`" :ref="el => setParticleRef(el, i-1)" class="checkbox-particle circle-particle" r="1.5" cx="12" cy="12" />
          <path :ref="el => setParticleRef(el, 10)" class="checkbox-particle star-particle" d="M 12 10 L 13 12 L 15 13 L 13 14 L 12 16 L 11 14 L 9 13 L 11 12 Z" />
          <circle v-for="i in 4" :key="`c2${i}`" :ref="el => setParticleRef(el, 10+i)" class="checkbox-particle circle-particle" r="1" cx="12" cy="12" />
        </g>
      </svg>
    </div>

    <span v-if="label" class="checkbox-label q-ml-sm">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { gsap } from 'gsap';

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  label: { type: String, default: '' },
});

const emits = defineEmits<Emits>();

const mainSvgRef = ref<SVGElement | null>(null);
const boxRef = ref<SVGRectElement | null>(null);
const checkRef = ref<SVGPathElement | null>(null);
const particlesGroupRef = ref<SVGGElement | null>(null);
const particlesRefs = ref<Array<SVGElement>>([]);

// Tamanho matemático exato do caminho "M 5 12 L 10 17 L 19 8".
// Usar fixo evita bugs de renderização inicial do Vue.
const PATH_LENGTH = 22;

const isCheckedInternal = computed({
  get() { return props.modelValue; },
  set(value: boolean) { emits('update:modelValue', value); }
});

const setParticleRef = (el: any, index: number) => {
  if (el) particlesRefs.value[index] = el;
};

const toggleChecked = () => {
  const newState = !isCheckedInternal.value;
  isCheckedInternal.value = newState;
  if (newState) {
    playCheckAnimation();
  } else {
    resetCheckAnimation();
  }
};

const playCheckAnimation = () => {
  if (!mainSvgRef.value || !boxRef.value || !checkRef.value || !particlesGroupRef.value || particlesRefs.value.length === 0) return;

  const tl = gsap.timeline();

  // Prepara o checkmark
  gsap.set(checkRef.value, { strokeDasharray: PATH_LENGTH, strokeDashoffset: PATH_LENGTH, opacity: 1 });

  // O PULO & DESENHO
  tl.to(mainSvgRef.value, { rotate: 360, scale: 0.9, duration: 0.2, ease: "power1.out" })
    .to(boxRef.value, { scale: 0.9, transformOrigin: "center", duration: 0.1, ease: "power1.out" }, "-=0.2")
    .to(checkRef.value, { strokeDashoffset: 0, duration: 0.3, ease: "power1.out" }, "-=0.1");

  // EXPLOSÃO DE FOGOS (Corrigido!)
  const apexTl = gsap.timeline();
  particlesRefs.value.forEach((particle, index) => {
    const angle = (index / particlesRefs.value.length) * 2 * Math.PI + (Math.random() - 0.5) * 0.2;
    const distance = gsap.utils.random(25, 45);
    const velocity = gsap.utils.random(0.5, 0.9);
    const targetX = Math.cos(angle) * distance;
    const targetY = Math.sin(angle) * distance;

    // Usamos fromTo para garantir que eles fiquem visíveis (opacity: 1) no momento da explosão
    apexTl.fromTo(particle,
      { x: 0, y: 0, scale: 0.5, opacity: 1 }, // INÍCIO: Visível e no centro
      {
        x: targetX,
        y: targetY,
        scale: gsap.utils.random(1.5, 2.5),
        opacity: 0, // FIM: Desaparece na ponta
        duration: velocity,
        ease: "power2.out",
      },
      index * 0.01
    );
  });

  tl.add(apexTl, "-=0.1");

  // CAINDO DE VOLTA
  tl.to(mainSvgRef.value, { scale: 1, duration: 1, ease: "bounce" }, "-=0.3")
    .to(boxRef.value, { scale: 1, duration: 0.2, ease: "power1.in" }, "-=0.2")
    .set(mainSvgRef.value, { rotate: 0 }); // Reseta a rotação para evitar acúmulo de transformações
};

const resetCheckAnimation = () => {
    if (!checkRef.value || particlesRefs.value.length === 0) return;

    gsap.to(checkRef.value, { strokeDashoffset: PATH_LENGTH, duration: 0.15 });

    particlesRefs.value.forEach(p => {
        gsap.killTweensOf(p);
        gsap.set(p, { x: 0, y: 0, scale: 1, opacity: 0 });
    });
};
onMounted(() => {
  // 1. Esconde as partículas de fogos
  particlesRefs.value.forEach(p => gsap.set(p, { x: 0, y: 0, scale: 1, opacity: 0 }));

  // 2. Verifica se JÁ ESTÁ marcado ao carregar a página
  if (checkRef.value) {
    if (props.modelValue) {
      // Se já veio como "true" (done), mostra o V branco imediatamente sem animar
      gsap.set(checkRef.value, { strokeDasharray: PATH_LENGTH, strokeDashoffset: 0, opacity: 1 });
    } else {
      // Se não, deixa escondido
      gsap.set(checkRef.value, { strokeDasharray: PATH_LENGTH, strokeDashoffset: PATH_LENGTH, opacity: 0 });
    }
  }
});

// Removemos o { immediate: true } para não dar conflito antes do DOM existir.
// Esse watch agora só serve se o valor for alterado por FORA do componente.
watch(() => props.modelValue, (newValue) => {
  if (!checkRef.value) return;
  if (newValue) {
      gsap.set(checkRef.value, { strokeDasharray: PATH_LENGTH, strokeDashoffset: 0, opacity: 1 });
  } else {
      gsap.set(checkRef.value, { strokeDasharray: PATH_LENGTH, strokeDashoffset: PATH_LENGTH, opacity: 0 });
  }
});
</script>

<style scoped>
.animated-checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: start;
  cursor: pointer;
  position: relative;
  min-width: 24px;
  min-height: 24px;
  width: 100%;
}

.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.animated-checkbox-svg {
  overflow: visible;
  pointer-events: none;
}

/* Quadrado base */
.checkbox-box {
  fill: transparent;
  stroke: var(--q-primary, #19d257);
  stroke-width: 2;
  rx: 4;
  transition: fill 0.2s ease, stroke 0.2s ease;
  transform-origin: center;
}

/* Quadrado marcado */
.checkbox-box-checked {
  fill: var(--q-checked, #19d238);
  stroke: var(--q-checked, #19d251);
}

/* Checkmark */
.checkmark-path {
  fill: none;
  stroke: white;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  /* Comentário corrigido para o padrão CSS! */
}

/* Partículas */
.checkbox-particles {
  overflow: visible;
}

.checkbox-particle {
  fill: #FFB300; /* Cor fixa dourada/amarela para os fogos se destacarem bem! */
  opacity: 0;
}

.star-particle {
  stroke: #FF8F00;
  stroke-width: 0.5;
}

.checkbox-label {
  font-size: 1rem;
}

.checklist-item {
  transition: filter 0.3s ease;
  border: 1px solid transparent;

  /* ADICIONE ESTA LINHA: Garante que os fogos não sejam cortados pelas bordas do q-item */
  overflow: visible !important;
}
</style>
