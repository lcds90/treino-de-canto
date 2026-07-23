## 1. Instalação e Criação do Componente YoutubePlayer

- [x] 1.1 Executar `yarn add youtube-player` para instalar a biblioteca de controle do player do YouTube
- [x] 1.2 Atualizar `src/components/models.ts` para adicionar a interface `VideoTimestamp` e o campo `timestamps?: VideoTimestamp[]` na interface `RoutineTask`
- [x] 1.3 Criar o novo arquivo de componente Vue `src/components/YoutubePlayer.vue`
- [x] 1.4 Importar e inicializar o `YouTubePlayer` sobre uma `div` com ID dinâmico único (ex: `yt-player-${taskId}`) dentro do hook `onMounted`
- [x] 1.5 Utilizar `defineExpose` para expor o método `seekTo(seconds)` da biblioteca para o componente pai `RoutineCard.vue`
- [x] 1.6 Adicionar tratamento de timeout de 5 segundos para carregar o `<q-video>` convencional de fallback em caso de falha ou bloqueio da biblioteca

## 2. Atualização do Formulário de Rotinas (RoutineForm)

- [x] 2.1 Adicionar a interface de gerenciamento de timestamps no template de `src/components/RoutineForm.vue`
- [x] 2.2 Configurar exibição condicional da seção de timestamps apenas se a plataforma selecionada for "youtube"
- [x] 2.3 Implementar campos de input para novo Rótulo e Tempo com regras de validação (aceitar MM:SS ou segundos puros)
- [x] 2.4 Desenvolver funções de controle de lista (Adicionar, Remover) que atualizam o array de timestamps no formulário, realizando a conversão de strings MM:SS para segundos inteiros
- [x] 2.5 Garantir que os timestamps sejam limpos do formulário se a plataforma for alterada para outra que não seja YouTube antes de salvar

## 3. Integração e Atalhos no Card de Rotinas (RoutineCard)

- [x] 3.1 Modificar `src/components/RoutineCard.vue` para substituir o componente estático `<q-video>` pelo novo `<YoutubePlayer>` com referência `ref`
- [x] 3.2 Renderizar botões/chips estilizados de atalho para cada timestamp abaixo do player de vídeo no layout do card
- [x] 3.3 Adicionar método `seekVideo(seconds)` em `RoutineCard.vue` que aciona a referência exposta do player chamando `playerRef.value.seekTo(seconds)`
- [x] 3.4 Implementar função utilitária local `formatSeconds(sec)` em `RoutineCard.vue` para formatar os segundos exibidos nos botões de volta para o padrão MM:SS

## 4. Validação e Testes

- [x] 4.1 Executar a aplicação localmente usando `quasar dev`
- [x] 4.2 Cadastrar um novo card de rotina do tipo YouTube, adicionando múltiplos timestamps com diferentes formatos (MM:SS e segundos)
- [x] 4.3 Reproduzir o vídeo e validar se os cliques nos botões de atalho alteram instantaneamente a reprodução do vídeo para a posição correta
- [x] 4.4 Simular falha de rede/bloqueio do script do YouTube para validar se o player de fallback `<q-video>` é montado e os botões se mantêm informativos ou desabilitados de forma elegante
