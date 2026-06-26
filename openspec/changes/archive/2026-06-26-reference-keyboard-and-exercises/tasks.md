## 1. Configurações de Estado e Persistência

- [x] 1.1 Adicionar propriedade `vocalRange` no `useSettingsStore` (arquivo [settings-store.ts](file:///home/lcds/projects/rotina-canto/src/stores/settings-store.ts)) com valor padrão `'tenor'`.
- [x] 1.2 Atualizar as funções de sincronização (`loadDataIntoState` e `saveToStorage`) do `useSettingsStore` para carregar e salvar a classificação vocal localmente e remotamente (Firebase Firestore).
- [x] 1.3 Implementar a ação `updateVocalRange` no `useSettingsStore` para alterar e salvar o naipe vocal.

## 2. Motor de Sintetizador e Gerador de Exercícios

- [x] 2.1 Criar o arquivo `src/services/audio-synthesizer.ts` para encapsular a inicialização e controle do `AudioContext` da Web Audio API.
- [x] 2.2 Implementar método `playNote` em `audio-synthesizer.ts` com um envelope ADSR básico (gerenciamento de ganho gradual) para eliminar estalos e cliques ao tocar frequências.
- [x] 2.3 Criar o arquivo `src/services/vocal-exercise-generator.ts` contendo as definições dos naipes (faixa confortável de notas) e padrões de intervalos semitonais para Vocalizes e Melismas.
- [x] 2.4 Implementar função `generateExerciseNotes(vocalRange, exerciseType)` que transponha os padrões para a tessitura correta e retorne um array de notas estruturado (frequência, nome, duração).

## 3. Componentes de Interface do Afinador e Perfil

- [x] 3.1 Desenvolver o componente `src/components/ReferenceKeyboard.vue` exibindo um piano de 1 oitava (Dó4 a Si4) e botões rápidos para Dó, Ré e Mi que tocam áudio pelo `audio-synthesizer.ts`.
- [x] 3.2 Injetar o botão flutuante secundário do teclado de referência em [MainLayout.vue](file:///home/lcds/projects/rotina-canto/src/layouts/MainLayout.vue) para disponibilizá-lo em todo o app.
- [x] 3.3 Adicionar a seleção do Naipe Vocal (seletor com exibição da tessitura típica) dentro de [ThemeSettings.vue](file:///home/lcds/projects/rotina-canto/src/components/ThemeSettings/ThemeSettings.vue).

## 4. Exercícios Dinâmicos nas Rotinas

- [x] 4.1 Expandir a interface `RoutineTask` em [models.ts](file:///home/lcds/projects/rotina-canto/src/components/models.ts) para suportar novas plataformas como `vocalize` e `melisma`.
- [x] 4.2 Criar um componente player/card de exercício de vocalização interativo dentro de [RoutineCard.vue](file:///home/lcds/projects/rotina-canto/src/components/RoutineCard.vue) para reproduzir as sequências de notas do exercício geradas de acordo com o naipe do usuário.
- [x] 4.3 Implementar realce visual da nota atualmente sendo tocada no player durante a reprodução do exercício.

## 5. Testes e Validação

- [x] 5.1 Adicionar teste do Cypress cobrindo a abertura do teclado de referência e a alteração da classificação vocal na página de configurações.
- [x] 5.2 Testar a execução e o timbre senoidal no navegador (Pronto para validação manual no navegador).
