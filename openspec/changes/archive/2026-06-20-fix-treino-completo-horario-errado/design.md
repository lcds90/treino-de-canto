## Context

Atualmente, o cronômetro do treino computa a duração incorretamente quando o tempo ultrapassa 1 hora. A propriedade computada `formattedTime` no Pinia store [workout-store.ts](file:///home/lcds/projects/rotina-canto/src/stores/workout-store.ts) calcula os minutos totais dividindo o tempo total por 60 (`Math.floor(elapsedSeconds.value / 60)`). Quando as horas (`h`) são maiores que zero, esses minutos deveriam refletir apenas a porção restante após subtrair as horas, ou seja, o resto da divisão por 3600 segundos dividido por 60.

## Goals / Non-Goals

**Goals:**
- Ajustar a lógica de cálculo do cronômetro para que os minutos sejam redefinidos para `00` a cada hora decorrida (exemplo: de `01:74:22` para `01:14:22`).
- Garantir compatibilidade de formato para tempos menores de uma hora (`MM:SS`) e maiores de uma hora (`HH:MM:SS`).

**Non-Goals:**
- Alterar outras propriedades do temporizador como persistência, início ou pausa.
- Modificar o armazenamento de dados no Firebase.

## Decisions

### Decisão 1: Ajuste da propriedade computada `formattedTime`
- **Escolha**: Modificar a fórmula da variável `m` no [workout-store.ts](file:///home/lcds/projects/rotina-canto/src/stores/workout-store.ts):
  ```typescript
  const h = Math.floor(elapsedSeconds.value / 3600);
  const m = Math.floor((elapsedSeconds.value % 3600) / 60).toString().padStart(2, '0');
  const s = (elapsedSeconds.value % 60).toString().padStart(2, '0');
  ```
- **Racional**: A utilização do operador módulo `% 3600` isola os segundos pertencentes à hora corrente antes de converter em minutos, assegurando que o contador de minutos nunca ultrapasse 59.
- **Alternativas consideradas**: Calcular os minutos subtraindo `h * 60` do valor antigo de `m`. Essa alternativa é mais complexa e propensa a erros matemáticos.

## Risks / Trade-offs

- **Risco**: Regressão visual em locais que renderizam a duração.
- **Mitigação**: O uso de `formattedTime` foi auditado e sua exibição está isolada no chip do cronômetro e no pop-up de finalização do treino em [RoutineActions.vue](file:///home/lcds/projects/rotina-canto/src/components/RoutineActions.vue).
