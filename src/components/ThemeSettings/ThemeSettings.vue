<template>
  <q-card class="shadow-4 q-pa-md" style="border-radius: 16px">
    <q-card-section class="q-pb-none">
      <div class="text-h5 text-weight-bold text-primary q-mb-md">
        <q-icon name="palette" class="q-mr-sm" /> Configurações do App
      </div>
    </q-card-section>

    <q-scroll-area style="height: 60vh; max-height: 500px">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold q-mb-sm">Idioma (Language)</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              v-model="localLanguage"
              :options="languageOptions"
              label="Idioma do App"
              outlined
              dense
              emit-value
              map-options
              @update:model-value="onLanguageChange"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator class="q-mx-md" />

      <q-card-section>
        <div class="row items-center justify-between q-mb-md">
          <div class="text-subtitle1 text-weight-bold">Paleta de Cores</div>
          <div class="row q-gutter-sm">
            <q-toggle
              v-model="localDark"
              checked-icon="dark_mode"
              unchecked-icon="light_mode"
              label="Modo escuro (Dark mode)"
              color="primary"
              size="lg"
              @update:model-value="settingsStore.toggleDarkMode"
            />
            <q-btn
              flat
              color="negative"
              icon="restore"
              label="Resetar Tudo"
              @click="settingsStore.resetAllColors"
              size="sm"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12"></div>
          <div
            v-for="(hex, colorName) in settingsStore.themeColors"
            :key="colorName"
            class="col-12 col-sm-6 col-md-4 flex items-center justify-between"
          >
            <div class="row items-center">
              <q-btn
                round
                unelevated
                :style="{ backgroundColor: hex }"
                class="q-mr-sm shadow-1 border-color"
              >
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color
                    v-model="settingsStore.themeColors[colorName]"
                    no-header
                    no-footer
                    @update:model-value="
                      (newHex: string | null) => onColorChange(colorName, newHex)
                    "
                  />
                </q-popup-proxy>
              </q-btn>
              <div>
                <div class="text-weight-bold text-capitalize">{{ colorName }}</div>
                <div class="text-caption text-grey-6">{{ hex }}</div>
              </div>
            </div>
            <q-btn
              flat
              round
              size="sm"
              icon="restart_alt"
              color="grey-6"
              @click="settingsStore.resetColor(String(colorName))"
              ><q-tooltip>Resetar para o padrão</q-tooltip></q-btn
            >
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

const localDark = ref(settingsStore.isDark);
const localLanguage = ref(settingsStore.language);

const languageOptions = [
  { label: 'Português (pt-BR)', value: 'pt-BR' },
  { label: 'English (en-US)', value: 'en-US' },
  { label: 'Español (es)', value: 'es' },
];

watch(
  () => settingsStore.isDark,
  (val) => (localDark.value = val),
);

watch(
  () => settingsStore.language,
  (val) => (localLanguage.value = val),
);

const onLanguageChange = (val: string) => {
  settingsStore.updateLanguage(val);
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
