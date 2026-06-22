## Why

Para praticar canto de forma eficiente, o controle de tempo e ritmo é essencial. Esta melhoria refina o metrônomo para ter um visual clássico mecânico (piramidal tradicional) com animações realistas em GSAP, onde o peso deslizante do braço se desloca fisicamente de acordo com o BPM selecionado, oferecendo uma experiência analógica de alta fidelidade integrada ao app.

## What Changes

- **Nova Rota Protegida**: Rota `/metronomo` acessível apenas para usuários logados.
- **Aba no Layout Principal**: Nova aba "Metrônomo" no [MainLayout.vue](file:///home/lcds/projects/rotina-canto/src/layouts/MainLayout.vue).
- **Interface de Contêiner Único**: Contêiner unificado responsivo de `max-width: 480px` com fases de Configuração e Execução.
- **Visualizador de Metrônomo Mecânico em SVG/GSAP**:
  - **Corpo Clássico**: Desenho piramidal de madeira com placa metálica de escala de andamento.
  - **Braço do Pêndulo**: Haste metálica oscilante que se move lateralmente usando física suave (`ease: "sine.inOut"`), sincronizada perfeitamente ao BPM.
  - **Peso Deslizante Reativo**: O peso metálico na haste desliza para cima (ritmo mais lento / BPM menor) ou para baixo (ritmo mais rápido / BPM maior) de forma dinâmica em tempo real conforme o usuário ajusta as configurações.
  - **Flash de Batida Integrado**: A placa frontal do metrônomo pisca suavemente com a cor ativa do tema Quasar, com maior intensidade no tempo forte (beat 0).
- **Transição Automática**: Retorno automático do contêiner para a Fase de Configuração no término do tempo de prática.

## Capabilities

### New Capabilities

- `animated-metronome`: Página de contêiner único responsivo contendo metrônomo mecânico de madeira com pêndulo oscilante e peso deslizante dinâmico via GSAP, temporizador de prática, áudio look-ahead e integração de cores com o tema Quasar do usuário.

### Modified Capabilities

Nenhuma capacidade existente sofrerá alteração de requisitos.

## Impact

- **Componentes e Páginas**:
  - Atualização de `src/pages/MetronomePage.vue` com o design de metrônomo tradicional mecânico.
- **Plano de Rollback**:
  - Reverter as alterações nos arquivos de rotas, remover a aba e deletar a página `/metronomo`.
