## Why

Atualmente, o cronômetro do treino calcula incorretamente os minutos exibidos quando a duração ultrapassa uma hora, gerando valores como `01:74:22` em vez de `01:14:22` (pois os minutos acumulados não são resetados a cada hora). Isso causa confusão na visualização do tempo de treino realizado.

## What Changes

- **Correção da Formatação do Tempo**: Ajustar a propriedade computada `formattedTime` no Pinia store para calcular os minutos limitados a 59 (utilizando o resto da divisão por 3600 segundos).

## Capabilities

### New Capabilities

- `workout-timer`: Ajustar a formatação de tempo do cronômetro do treino para exibição correta de horas, minutos e segundos no resumo do treino concluído.

### Modified Capabilities

## <!-- Nenhuma especificação existente está sendo modificada -->

## Impact

- **Pinia Store**: [workout-store.ts](file:///home/lcds/projects/rotina-canto/src/stores/workout-store.ts) será alterada na computada `formattedTime`.
- **Componentes Afetados**: [RoutineActions.vue](file:///home/lcds/projects/rotina-canto/src/components/RoutineActions.vue) que exibe o resumo com `formattedTime`.
