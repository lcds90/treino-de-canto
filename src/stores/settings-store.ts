// src/stores/settings-store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { setCssVar, Dark } from 'quasar';
import { settingsService } from 'src/services'; // <-- Importa o serviço

export const DEFAULT_COLORS: Record<string, string> = {
  primary: '#1976D2',
  secondary: '#26A69A',
  accent: '#9C27B0',
  positive: '#21BA45',
  negative: '#C10015',
  info: '#31CCEC',
  warning: '#F2C037',
  dark: '#1D1D1D',
  'dark-page': '#121212',
};

export const useSettingsStore = defineStore('settings', () => {
  // --- STATE ---
  const isDark = ref(false);
  const appTitle = ref('Rotina de Canto 🎤');
  const appDescription = ref('Seu painel de evolução vocal.');
  const workoutTitle = ref('🎧 Hora de Soltar a Voz! 🎶');
  const workoutSubtitle = ref(
    'Siga as instruções de cada vídeo e marque os exercícios concluídos.',
  );
  const bannerTitle = ref('Hoje um treino já foi registrado! 💪');
  const bannerSubtitle = ref('Mas sinta-se livre para treinar mais! 🎶');
  const themeColors = ref<Record<string, string>>({ ...DEFAULT_COLORS });

  const isLoading = ref(false);

  // Variável para controlar o timer do Debounce
  let firebaseSaveTimeout: ReturnType<typeof setTimeout>;

  // --- FUNÇÕES INTERNAS ---
  const applySettings = () => {
    Dark.set(isDark.value);
    document.title = appTitle.value;
    for (const [name, hex] of Object.entries(themeColors.value)) {
      setCssVar(name, hex);
    }
  };

  const loadDataIntoState = (data: any) => {
    isDark.value = data.isDark ?? false;
    appTitle.value = data.appTitle ?? 'Rotina de Canto 🎤';
    appDescription.value = data.appDescription ?? 'Seu painel de evolução vocal.';
    workoutTitle.value = data.workoutTitle ?? '🎧 Hora de Soltar a Voz! 🎶';
    workoutSubtitle.value =
      data.workoutSubtitle ?? 'Siga as instruções de cada vídeo e marque os exercícios concluídos.';
    bannerTitle.value = data.bannerTitle ?? 'Hoje um treino já foi registrado! 💪';
    bannerSubtitle.value = data.bannerSubtitle ?? 'Mas sinta-se livre para treinar mais! 🎶';
    themeColors.value = { ...DEFAULT_COLORS, ...data.themeColors };
  };

  // --- ACTIONS ---

  // Inicializa buscando do Firebase primeiro
  const initSettings = async () => {
    isLoading.value = true;
    try {
      // 1. Tenta pegar do Firebase
      const remoteSettings = await settingsService.getSettings();

      if (remoteSettings) {
        loadDataIntoState(remoteSettings);
        // Atualiza o backup local
        localStorage.setItem('app_settings', JSON.stringify(remoteSettings));
      } else {
        // 2. Se não tem no Firebase, tenta o LocalStorage
        const localSettings = localStorage.getItem('app_settings');
        if (localSettings) {
          loadDataIntoState(JSON.parse(localSettings));
        }
      }
    } catch (error) {
      console.error('Erro ao buscar configurações do Firebase. Usando backup local.', error);
      const localSettings = localStorage.getItem('app_settings');
      if (localSettings) loadDataIntoState(JSON.parse(localSettings));
    } finally {
      applySettings();
      isLoading.value = false;
    }
  };

  // Salva no Storage instantaneamente e faz Debounce no Firebase
  const saveToStorage = () => {
    const dataToSave = {
      isDark: isDark.value,
      appTitle: appTitle.value,
      appDescription: appDescription.value,
      workoutTitle: workoutTitle.value,
      workoutSubtitle: workoutSubtitle.value,
      bannerTitle: bannerTitle.value,
      bannerSubtitle: bannerSubtitle.value,
      themeColors: themeColors.value,
    };

    // 1. App fica rápido: Salva local e aplica CSS na hora
    localStorage.setItem('app_settings', JSON.stringify(dataToSave));
    applySettings();

    // 2. Firebase fica seguro: Cancela o timer anterior se existir e cria um novo
    clearTimeout(firebaseSaveTimeout);

    firebaseSaveTimeout = setTimeout(async () => {
      try {
        await settingsService.saveSettings(dataToSave);
        console.log('⚙️ Configurações sincronizadas com a nuvem!');
      } catch (error) {
        console.error('Erro ao salvar configurações na nuvem:', error);
      }
    }, 1000); // Aguarda 1 segundo de "silêncio" antes de enviar para o banco
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
    if (DEFAULT_COLORS[colorName]) {
      themeColors.value[colorName] = DEFAULT_COLORS[colorName];
      saveToStorage();
    }
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
    isLoading,
    initSettings,
    toggleDarkMode,
    updateAppMeta,
    updateWorkoutMeta,
    updateColor,
    resetColor,
    resetAllColors,
  };
});
