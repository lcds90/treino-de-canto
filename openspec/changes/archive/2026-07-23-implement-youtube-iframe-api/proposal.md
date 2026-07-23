## Why

Atualmente, ao utilizar vídeos do YouTube para rotinas de treino vocal (como aulas de canto completas, aquecimentos específicos ou acompanhamentos de escalas), os cantores precisam avançar ou retroceder manualmente o vídeo para encontrar a seção correta de prática. Esse processo interrompe o fluxo de treino. 

Integrar a YouTube Iframe Player API com suporte a marcações de tempo (timestamps) personalizadas permitirá que o usuário navegue instantaneamente para seções específicas do vídeo de treino (ex: "Aquecimento", "Exercício de Agilidade") diretamente através de botões na interface do card. 

Para manter o código modular, evitar a poluição do escopo global (`window`) e simplificar o gerenciamento do ciclo de vida da API, utilizaremos o pacote NPM `youtube-player`.

## What Changes

- **Instalação de Dependência**: Adição do pacote `youtube-player` às dependências do projeto para abstração da API de Iframe do YouTube.
- **Esquema de Rotinas Estendido**: Adição do campo opcional `timestamps` no modelo `RoutineTask` para guardar uma lista de marcações de tempo (cada uma contendo rótulo/descrição e o tempo correspondente em segundos).
- **Editor de Marcações Condicional**: Inclusão de uma interface dinâmica (adicionar, editar, remover marcações de tempo) no formulário de criação/edição de rotinas (`RoutineForm.vue`), exibida apenas quando o tipo do card selecionado for "YouTube".
- **Visualização de Seções no Card**: Exibição de atalhos rápidos ("Pular para seção") na visualização do card de rotina (`RoutineCard.vue`) com os rótulos configurados pelo usuário.
- **Navegação Inteligente por seekTo()**: Integração com o player modular `youtube-player` para que, ao clicar em um botão de seção, o player realize uma busca instantânea para o tempo definido no vídeo usando o método `seekTo()`.

## Capabilities

### New Capabilities
- `youtube-iframe-api`: Capacidade de integração dinâmica com a API do YouTube, controle de reprodução (seekTo) e gerenciamento de lista de timestamps por rotina.

### Modified Capabilities
<!-- Nenhuma especificação de funcionalidade existente será alterada em termos de requisitos de negócio, apenas no detalhe da implementação técnica do player. -->

## Impact

### Affected Code & Components
- **`package.json`**: Registro da dependência `youtube-player`.
- **`src/components/models.ts`**: Adição do tipo `VideoTimestamp` e atualização do `RoutineTask` para incluir `timestamps?: VideoTimestamp[]`.
- **`src/components/RoutineForm.vue`**: Adição do formulário de gerenciamento de timestamps (campos de rótulo e tempo no formato MM:SS ou segundos, com validação e botões de adicionar/remover), exibido condicionalmente.
- **`src/components/RoutineCard.vue`**: Renderização da interface de botões rápidos para salto de seção e injeção do player encapsulado.
- **`src/components/YoutubePlayer.vue`**: Criação de um componente wrapper para a biblioteca `youtube-player`, tratando eventos como alteração de estado e expondo o método de salto.

### Dependencies
- Adição da dependência de produção NPM `youtube-player`.

### Visual Impact & Connection
- O card de rotinas do YouTube agora contará com uma seção inferior contendo botões estilizados (chips ou botões com ícones) contendo as seções de treino. O formulário terá uma área de inserção flexível e listagem de timestamps.

### Rollback Plan
- Se a biblioteca falhar em carregar ou o vídeo falhar por problemas de rede, o componente ativa o fallback exibindo o `<q-video>` padrão do Quasar, mantendo a lista de timestamps como guia de leitura textual informativa para o cantor.

### Affected Teams
- **Desenvolvedor Solo (lcds90)**: Desenvolvimento frontend e testes com Cypress.
