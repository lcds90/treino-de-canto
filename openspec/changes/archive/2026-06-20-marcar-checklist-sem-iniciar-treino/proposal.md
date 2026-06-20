## Why

Atualmente, o usuário consegue marcar itens da checklist de exercícios na rotina de canto mesmo sem ter iniciado um treino (cronômetro). Isso pode gerar inconsistências nos dados de progresso e no histórico, além de diminuir o engajamento com o uso do cronômetro.

## What Changes

- **Restrição na marcação da checklist**: O usuário não poderá marcar itens da checklist de hoje sem que o treino esteja ativo.
- **Diálogo de confirmação**: Caso tente marcar um item sem ter iniciado o treino, será exibido um diálogo perguntando se deseja iniciar o treino naquele momento.
- **Início automático**: Ao confirmar a inicialização do treino no diálogo, o cronômetro de treino será iniciado imediatamente, limpando estados de checklists anteriores e marcando o item clicado.

## Capabilities

### New Capabilities

*(Nenhuma)*

### Modified Capabilities

- `workout-timer`: O treino precisa estar ativo para que o progresso na checklist de hoje seja marcado, guiando o usuário a iniciar o treino de forma fluida.

## Impact

- Componentes Vue: `RoutineCard.vue` e `AnimatedCheckbox.vue`.
- Stores Pinia: `workout-store` e `routine-store` (para controle do estado do treino e das rotinas).
