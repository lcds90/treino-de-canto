<template>
  <q-page class="flex flex-center bg-grey-1" :class="{ 'bg-grey-10': $q.dark.isActive }">
    <div class="column items-center max-width-container q-pa-md">
      <div class="text-center q-mb-lg">
        <h1 class="text-h4 text-weight-bold text-primary q-mb-xs">
          Afinador de Referência
        </h1>
        <p :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'" class="text-subtitle2">
          Toque nas notas ou use o teclado de referência para guiar sua voz.
        </p>
      </div>

      <!-- Seletor de Classificação Vocal -->
      <q-card class="full-width q-mb-md shadow-2 border-radius-16" :class="{ 'bg-dark text-white': $q.dark.isActive }">
        <q-card-section class="row items-center justify-between q-py-md">
          <div class="text-subtitle1 text-weight-bold text-primary col-12 col-sm-6 q-mb-sm q-mb-sm-none">
            Classificação Vocal Atual:
          </div>
          <div class="col-12 col-sm-6">
            <q-select
              v-model="selectedVocalRange"
              :options="vocalRangeOptions"
              label="Classificação Vocal"
              outlined
              dense
              emit-value
              map-options
              :dark="$q.dark.isActive"
            />
          </div>
        </q-card-section>
      </q-card>

      <div class="keyboard-wrapper shadow-4">
        <ReferenceKeyboard hide-close large />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ReferenceKeyboard from 'src/components/ReferenceKeyboard.vue';
import { useQuasar } from 'quasar';
import { useSettingsStore } from 'src/stores/settings-store';
import { VOCAL_RANGES } from 'src/services';

const $q = useQuasar();
const settingsStore = useSettingsStore();

const selectedVocalRange = computed({
  get() {
    return settingsStore.vocalRange;
  },
  set(val) {
    settingsStore.updateVocalRange(val);
  }
});

const vocalRangeOptions = Object.entries(VOCAL_RANGES).map(([key, info]) => ({
  label: `${info.name} (${info.description})`,
  value: key
}));
</script>

<style scoped>
.max-width-container {
  width: 100%;
  max-width: 1200px;
}

.border-radius-16 {
  border-radius: 16px;
}

.keyboard-wrapper {
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  display: inline-block;
  width: 100%;
}

.bg-grey-10 .keyboard-wrapper {
  background-color: #1e1e1e;
}
</style>
