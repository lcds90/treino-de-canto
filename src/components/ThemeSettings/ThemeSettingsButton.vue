<template>
  <q-btn
    ref="settingsBtnRef"
    flat
    round
    icon="settings"
    color="grey-6"
    class="absolute-top-right q-mt-md q-mr-md"
    style="z-index: 10;"
    @click="isOpen = true"
  >
    <q-tooltip>Configurações do App</q-tooltip>
  </q-btn>

  <q-dialog v-model="isOpen" transition-show="scale" transition-hide="scale">
    <ThemeSettings style="width: 700px; max-width: 95vw;" />
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import ThemeSettings from './ThemeSettings.vue'; // Importa o formulário de dentro da mesma pasta

const isOpen = ref(false);
const settingsBtnRef = ref<any | null>(null);

onMounted(() => {
  // A animação da engrenagem fica isolada aqui!
  setTimeout(() => {
    if (settingsBtnRef.value) {
      gsap.from(settingsBtnRef.value.$el, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(2)'
      });
    }
  }, 100);
});
</script>
