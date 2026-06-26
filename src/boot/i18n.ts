import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import messages from 'src/i18n';

let i18nInstance: any;

export type MessageLanguages = keyof typeof messages;
export type MessageSchema = (typeof messages)['pt-BR'];

// Getter seguro para a instância do i18n
export function getI18n() {
  return i18nInstance;
}

// Helper funcional para atualizar o idioma com reatividade imediata em runtime
export function setLocale(lang: string) {
  if (i18nInstance) {
    if (typeof i18nInstance.global.locale === 'object' && 'value' in i18nInstance.global.locale) {
      i18nInstance.global.locale.value = lang;
    } else {
      i18nInstance.global.locale = lang;
    }
  }
}

// Função para obter o locale inicial
function getInitialLocale(): string {
  const savedLocale = localStorage.getItem('app-locale');
  if (savedLocale && ['pt-BR', 'en-US', 'es'].includes(savedLocale)) {
    return savedLocale;
  }

  const browserLocale = navigator.language || 'pt-BR';

  if (browserLocale.startsWith('pt')) {
    return 'pt-BR';
  } else if (browserLocale.startsWith('es')) {
    return 'es';
  } else if (browserLocale.startsWith('en')) {
    return 'en-US';
  }

  return 'pt-BR'; // Fallback padrão
}

export default boot(({ app }) => {
  i18nInstance = createI18n({
    legacy: false,
    locale: getInitialLocale(),
    fallbackLocale: 'pt-BR',
    messages,
    globalInjection: true,
  });

  app.use(i18nInstance);
});
