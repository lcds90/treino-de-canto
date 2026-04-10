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
    themeColors,
    initSettings,
    toggleDarkMode,
    updateAppMeta,
    updateColor,
    resetColor,
    resetAllColors
  };
});
