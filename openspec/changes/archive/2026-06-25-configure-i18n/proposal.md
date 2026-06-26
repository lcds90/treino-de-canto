## Why

Atualmente, o aplicativo de rotina de canto está disponível apenas em um único idioma (Português). Para tornar a aplicação acessível a uma audiência global de estudantes de canto e permitir a fácil expansão para outros idiomas (como inglês e espanhol), é necessário configurar e integrar um sistema de internacionalização (i18n). Além disso, a preferência de idioma selecionada deve ser sincronizada na nuvem com o banco de dados (coleção de configurações de usuário no Firestore) para manter a consistência entre diferentes dispositivos.

Por fim, a store `settings-store` deve ser limpa de variáveis estáticas, mantendo apenas `appDescription` e `workoutTitle` como propriedades dinâmicas reativas, cujos conteúdos serão selecionados de forma sorteada (aleatória) a partir de arrays de traduções no dicionário correspondente ao idioma ativo. As outras propriedades de texto (`appTitle`, `workoutSubtitle`, `bannerTitle` e `bannerSubtitle`) serão removidas do Firestore e da store do Pinia, convertendo-se em traduções estáticas normais no vue-i18n, simplificando consideravelmente a arquitetura de configurações.

## What Changes

- Instalação da biblioteca `vue-i18n` (compatível com Vue 3) como dependência do projeto.
- Configuração do plugin i18n do Quasar através de um novo boot file (`src/boot/i18n.ts`) que expõe um método centralizado `setLocale` e um getter de instância para garantir o correto funcionamento reativo e evitar problemas de ESM live bindings indefinidos.
- Criação da estrutura de pastas para os idiomas suportados (inicialmente `pt-BR`, `en-US` e `es`) sob `src/i18n/`.
- Configuração do Quasar para registrar o boot file de i18n em `quasar.config.ts`.
- Tradução da interface inicial (página de login, layout principal ou telas principais) como demonstração e base de referência para futuras traduções nos três idiomas.
- Disponibilização de um seletor de idioma simples na interface para permitir a alternância de idioma pelo usuário entre português (`pt-BR`), inglês (`en-US`) e espanhol (`es`).
- Integração da preferência de idioma com a store `settings-store` do Pinia, sincronizando o valor escolhido com a coleção de `settings` do Firestore (documento do usuário correspondente).
- Remoção do Pinia e do banco Firestore dos textos estáticos `appTitle`, `workoutSubtitle`, `bannerTitle` e `bannerSubtitle`, transformando-os em chaves fixas no i18n e atualizando [IndexPage.vue](file:///home/lcds/projects/rotina-canto/src/pages/IndexPage.vue) e [RotinaPage.vue](file:///home/lcds/projects/rotina-canto/src/pages/RotinaPage.vue).
- Implementação de arrays de strings no i18n para as chaves `appDescription` e `workoutTitle`, permitindo a exibição dinâmica e aleatória (sorteada) na tela inicial e na tela de treinos.

## Capabilities

### New Capabilities

- `i18n`: Configuração e integração do suporte a múltiplos idiomas no aplicativo, habilitando a tradução dinâmica de textos de UI para português (`pt-BR`), inglês (`en-US`) e espanhol (`es`), formatações de data/número locais e persistência da preferência de idioma do usuário tanto localmente no navegador quanto remotamente na nuvem (Firestore).

### Modified Capabilities

## Impact

- **Código e Estrutura**: Adição de arquivos em `src/i18n/` e `src/boot/i18n.ts`. Alteração de `quasar.config.ts` para carregar o boot de i18n e alterar opcionalmente configurações do framework (se necessário). Alterações em `src/stores/settings-store.ts`, `src/layouts/MainLayout.vue`, `src/components/ThemeSettings/ThemeSettings.vue`, `src/pages/IndexPage.vue` e `src/pages/RotinaPage.vue`.
- **Dependências**: Adição de `vue-i18n` em `dependencies` no `package.json`.
- **Impacto Visual**: Inclusão de um componente seletor de idioma (dropdown ou botões de bandeira/código do idioma) no cabeçalho ou nas configurações do sistema, permitindo que o usuário alterne de forma imediata entre português (`pt-BR`), inglês (`en-US`) e espanhol (`es`). Os textos das telas afetadas passarão a ser dinâmicos, ajustando-se ao idioma selecionado.
- **Conexões com Módulos Existentes**: Todas as páginas e componentes de UI existentes (`user-authentication`, `animated-metronome`, `workout-timer`) farão uso da função global `$t` ou do hook `useI18n` do `vue-i18n` para renderizar seus textos.
- **Equipes Afetadas (Affected Teams)**:
  - Desenvolvedores de Front-end (necessidade de usar strings internacionalizadas em novos componentes e refatorar os antigos).
  - Equipes de Conteúdo/Tradução (responsáveis por fornecer e validar os arquivos de tradução).
- **Plano de Reversão (Rollback Plan)**: Caso ocorram problemas críticos em produção, a reversão envolverá a remoção do boot file `i18n` do `quasar.config.ts`, desativação do seletor de idioma e restauração do código que usava textos fixos (através do controle de versão git).
