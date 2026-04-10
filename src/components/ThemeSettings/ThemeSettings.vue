<template>
  <q-card class="shadow-4 q-pa-md" style="border-radius: 16px;">

    <q-card-section class="q-pb-none">
      <div class="text-h5 text-weight-bold text-primary q-mb-md">
        <q-icon name="palette" class="q-mr-sm" /> Configurações do App
      </div>
    </q-card-section>

    <q-scroll-area style="height: 60vh; max-height: 500px;">

      <q-card-section>
        <div class="text-subtitle1 text-weight-bold q-mb-sm">Home & Tema</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input v-model="localTitle" label="Título da Home" outlined dense @update:model-value="saveMeta" />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="localDesc" label="Descrição da Home" outlined dense @update:model-value="saveMeta" />
          </div>
        </div>
      </q-card-section>

      <q-separator class="q-mx-md" />

      <q-card-section>
        <div class="text-subtitle1 text-weight-bold q-mb-sm">Página de Treino</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input v-model="localWorkoutTitle" label="Título do Treino" outlined dense @update:model-value="saveWorkoutMeta" />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="localWorkoutSub" label="Subtítulo do Treino" outlined dense @update:model-value="saveWorkoutMeta" />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="localBannerTitle" label="Título do Aviso (Banner)" outlined dense @update:model-value="saveWorkoutMeta" />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="localBannerSub" label="Subtítulo do Aviso" outlined dense @update:model-value="saveWorkoutMeta" />
          </div>
        </div>
      </q-card-section>

      <q-separator class="q-mx-md" />

      <q-card-section>
        <div class="row items-center justify-between q-mb-md">
          <div class="text-subtitle1 text-weight-bold">Paleta de Cores</div>
          <div class="row q-gutter-sm">
            <q-toggle
              v-model="localDark" checked-icon="dark_mode" unchecked-icon="light_mode"
              label="Modo escuro (Dark mode)" color="primary" size="lg"
              @update:model-value="settingsStore.toggleDarkMode"
            />
          <q-btn flat color="negative" icon="restore" label="Resetar Tudo" @click="settingsStore.resetAllColors" size="sm" />

          </div>

        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12">

          </div>
          <div v-for="(hex, colorName) in settingsStore.themeColors" :key="colorName" class="col-12 col-sm-6 col-md-4 flex items-center justify-between">
            <div class="row items-center">
              <q-btn round unelevated :style="{ backgroundColor: hex }" class="q-mr-sm shadow-1 border-color">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="settingsStore.themeColors[colorName]" no-header no-footer @update:model-value="(newHex: string | null) => onColorChange(colorName, newHex)" />
                </q-popup-proxy>
              </q-btn>
              <div>
                <div class="text-weight-bold text-capitalize">{{ colorName }}</div>
                <div class="text-caption text-grey-6">{{ hex }}</div>
              </div>
            </div>
            <q-btn flat round size="sm" icon="restart_alt" color="grey-6" @click="settingsStore.resetColor(String(colorName))"><q-tooltip>Resetar para o padrão</q-tooltip></q-btn>
          </div>
        </div>
      </q-card-section>

    </q-scroll-area>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSettingsStore } from 'src/stores/settings-store';

const settingsStore = useSettingsStore();

const localTitle = ref(settingsStore.appTitle);
const localDesc = ref(settingsStore.appDescription);
const localDark = ref(settingsStore.isDark);

// NOVO: Refs locais para o treino
const localWorkoutTitle = ref(settingsStore.workoutTitle);
const localWorkoutSub = ref(settingsStore.workoutSubtitle);
const localBannerTitle = ref(settingsStore.bannerTitle);
const localBannerSub = ref(settingsStore.bannerSubtitle);

watch(() => settingsStore.isDark, (val) => localDark.value = val);
watch(() => settingsStore.appTitle, (val) => localTitle.value = val);
watch(() => settingsStore.appDescription, (val) => localDesc.value = val);

// NOVO: Escuta mudanças do treino
watch(() => settingsStore.workoutTitle, (val) => localWorkoutTitle.value = val);
watch(() => settingsStore.workoutSubtitle, (val) => localWorkoutSub.value = val);
watch(() => settingsStore.bannerTitle, (val) => localBannerTitle.value = val);
watch(() => settingsStore.bannerSubtitle, (val) => localBannerSub.value = val);

const saveMeta = () => {
  settingsStore.updateAppMeta(localTitle.value, localDesc.value);
};

// NOVO: Função para salvar o treino
const saveWorkoutMeta = () => {
  settingsStore.updateWorkoutMeta(
    localWorkoutTitle.value,
    localWorkoutSub.value,
    localBannerTitle.value,
    localBannerSub.value
  );
};

const onColorChange = (name: string | number, hex: string | null) => {
  if (hex) settingsStore.updateColor(String(name), hex);
};
</script>

<style scoped>
.border-color {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
