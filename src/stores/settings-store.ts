import { defineStore } from 'pinia';
import { ref } from 'vue';
import { setCssVar, Dark } from 'quasar';

// Cores originais baseadas no seu print
export const DEFAULT_COLORS: Record<string, string> = {
  primary: '#1976D2',
  secondary: '#26A69A',
  accent: '#9C27B0',
  positive: '#21BA45',
  negative: '#C10015',
  info: '#31CCEC',
  warning: '#F2C037',
  dark: '#1D1D1D',
  'dark-page': '#121212'
};

export const useSettingsStore = defineStore('settings', () => {
  // --- STATE ---
  const isDark = ref(false);
  const appTitle = ref('Rotina de Canto 🎤');
  const appDescription = ref('Seu painel de evolução vocal.');
  const workoutTitle = ref('🎧 Hora de Soltar a Voz! 🎶');
  const workoutSubtitle = ref('Siga as instruções de cada vídeo e marque os exercícios concluídos.');
  const bannerTitle = ref('Hoje um treino já foi registrado! 💪');
  const bannerSubtitle = ref('Mas sinta-se livre para treinar mais! 🎶');
  const themeColors = ref<Record<string, string>>({ ...DEFAULT_COLORS });

  // --- ACTIONS ---

  // Inicializa a Store lendo do LocalStorage (Roda ao abrir o app)
  const initSettings = () => {
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      isDark.value = parsed.isDark ?? false;
      appTitle.value = parsed.appTitle ?? 'Rotina de Canto 🎤';
      appDescription.value = parsed.appDescription ?? 'Seu painel de evolução vocal.';
      workoutTitle.value = parsed.workoutTitle ?? '🎧 Hora de Soltar a Voz! 🎶';
      workoutSubtitle.value = parsed.workoutSubtitle ?? 'Siga as instruções de cada vídeo e marque os exercícios concluídos.';
      bannerTitle.value = parsed.bannerTitle ?? 'Hoje um treino já foi registrado! 💪';
      bannerSubtitle.value = parsed.bannerSubtitle ?? 'Mas sinta-se livre para treinar mais! 🎶';
      themeColors.value = { ...DEFAULT_COLORS, ...parsed.themeColors };
    }

    applySettings();
  };

  // Aplica as configurações na interface (Quasar e DOM)
  const applySettings = () => {
    // Aplica Dark Mode
    Dark.set(isDark.value);

    // Aplica Title da aba do navegador
    document.title = appTitle.value;

    // Aplica as cores no CSS Root
    for (const [name, hex] of Object.entries(themeColors.value)) {
      setCssVar(name, hex);
    }
  };

  // Salva no LocalStorage
  const saveToStorage = () => {
    localStorage.setItem('app_settings', JSON.stringify({
      isDark: isDark.value,
      appTitle: appTitle.value,
      appDescription: appDescription.value,
      workoutTitle: workoutTitle.value,
      workoutSubtitle: workoutSubtitle.value,
      bannerTitle: bannerTitle.value,
      bannerSubtitle: bannerSubtitle.value,
      themeColors: themeColors.value
    }));
    applySettings();
  };

  const toggleDarkMode = (val: boolean) => {
    isDark.value = val;
    saveToStorage();
  };

  const updateAppMeta = (title: string, desc: string) => {
    appTitle.value = title;
    appDescription.value = desc;
    saveToStorage();
  };

  const updateWorkoutMeta = (wTitle: string, wSub: string, bTitle: string, bSub: string) => {
    workoutTitle.value = wTitle;
    workoutSubtitle.value = wSub;
    bannerTitle.value = bTitle;
    bannerSubtitle.value = bSub;
    saveToStorage();
  };

  const updateColor = (colorName: string, hexCode: string) => {
    themeColors.value[colorName] = hexCode;
    saveToStorage();
  };

  const resetColor = (colorName: string) => {
    themeColors.value[colorName] = DEFAULT_COLORS[colorName];
    saveToStorage();
  };

  const resetAllColors = () => {
    themeColors.value = { ...DEFAULT_COLORS };
    saveToStorage();
  };

  return {
    isDark,
    appTitle,
    appDescription,
    workoutTitle,       
    workoutSubtitle,
    bannerTitle,
    bannerSubtitle,
    themeColors,
    initSettings,
    toggleDarkMode,
    updateAppMeta,
    updateWorkoutMeta,
    updateColor,
    resetColor,
    resetAllColors
  };
});
