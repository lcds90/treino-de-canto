// src/stores/settings-store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { setCssVar, Dark } from 'quasar';
import { settingsService } from 'src/services';
import { setLocale, getI18n } from 'src/boot/i18n';
import { useAuthStore } from './auth-store';

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
  // Inicialização robusta de idioma que atende também usuários anônimos na tela de login
  const language = ref(localStorage.getItem('app-locale') ?? 'pt-BR');
  const themeColors = ref<Record<string, string>>({ ...DEFAULT_COLORS });
  const isLoading = ref(false);

  // Índices fixados por sessão para o sorteio reativo de textos traduzidos do i18n
  const randomDescIndex = ref(Math.floor(Math.random() * 100));
  const randomTitleIndex = ref(Math.floor(Math.random() * 100));

  // Variável para controlar o timer do Debounce
  let firebaseSaveTimeout: ReturnType<typeof setTimeout>;

  // --- GETTERS DINÂMICOS SORTEADOS DO I18N ---
  const appDescription = computed(() => {
    const i18n = getI18n();
    if (i18n) {
      const list = i18n.global.tm('appDescription') as string[];
      if (Array.isArray(list) && list.length > 0) {
        return list[randomDescIndex.value % list.length];
      }
    }
    return 'Seu painel de evolução vocal.'; // Fallback padrão
  });

  const workoutTitle = computed(() => {
    const i18n = getI18n();
    if (i18n) {
      const list = i18n.global.tm('workoutTitle') as string[];
      if (Array.isArray(list) && list.length > 0) {
        return list[randomTitleIndex.value % list.length];
      }
    }
    return '🎧 Hora de Soltar a Voz! 🎶'; // Fallback padrão
  });

  // --- FUNÇÕES INTERNAS ---
  const applySettings = () => {
    Dark.set(isDark.value);

    // Atualiza o título do documento de forma traduzida estática
    const i18n = getI18n();
    if (i18n) {
      document.title = i18n.global.t('title') ?? 'Rotina de Canto';
    } else {
      document.title = 'Rotina de Canto';
    }

    for (const [name, hex] of Object.entries(themeColors.value)) {
      setCssVar(name, hex);
    }
    // Sincroniza o idioma do vue-i18n através do helper reativo funcional
    setLocale(language.value);
  };

  const loadDataIntoState = (data: any) => {
    isDark.value = data.isDark ?? false;
    language.value = data.language ?? localStorage.getItem('app-locale') ?? 'pt-BR';
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
      language: language.value,
      themeColors: themeColors.value,
    };

    // 1. App fica rápido: Salva local e aplica CSS/Idioma na hora
    localStorage.setItem('app_settings', JSON.stringify(dataToSave));
    localStorage.setItem('app-locale', language.value);
    applySettings();

    // 2. Firebase fica seguro: Só salva na nuvem com debounce se o usuário estiver logado
    const authStore = useAuthStore();
    if (authStore.isAuthenticated) {
      clearTimeout(firebaseSaveTimeout);

      firebaseSaveTimeout = setTimeout(async () => {
        try {
          await settingsService.saveSettings(dataToSave);
          console.log('⚙️ Configurações sincronizadas com a nuvem!');
        } catch (error) {
          console.error('Erro ao salvar configurações na nuvem:', error);
        }
      }, 1000);
    }
  };

  const toggleDarkMode = (val: boolean) => {
    isDark.value = val;
    saveToStorage();
  };

  const updateLanguage = (lang: string) => {
    language.value = lang;
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
    language,
    themeColors,
    isLoading,
    appDescription,
    workoutTitle,
    initSettings,
    toggleDarkMode,
    updateLanguage,
    updateColor,
    resetColor,
    resetAllColors,
  };
});
