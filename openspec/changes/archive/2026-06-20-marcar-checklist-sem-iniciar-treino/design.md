## Context

O componente `AnimatedCheckbox` é responsável por renderizar a caixa de checklist de forma estilizada e disparar as animações ao marcar um item. Atualmente, ele gerencia seu estado e clique internamente e depois emite as alterações para o componente pai.
Para impor a regra de negócio de que um treino deve estar ativo, precisamos interceptar o evento de clique/marcação para exibir o diálogo de confirmação do Quasar.

## Goals / Non-Goals

**Goals:**
- Interceptação de clique na checklist para garantir que o treino seja iniciado antes de marcar um item.
- Exibição de caixa de diálogo para confirmação do início de treino caso o cronômetro esteja inativo.
- Atualização visual imediata após a confirmação.

**Non-Goals:**
- Não alterar o comportamento de desmarcação (o usuário pode desmarcar itens a qualquer momento).
- Não alterar outras partes visuais ou estruturais dos componentes envolvidos.

## Decisions

### Decisão 1: Adicionar propriedade `beforeToggle` no `AnimatedCheckbox`
- **Alternativa A (Escolhida)**: Criar uma prop `beforeToggle` do tipo `Function` no `AnimatedCheckbox` que recebe uma função retornando `Promise<boolean>` ou `boolean`. O checkbox aguarda a resolução do callback antes de atualizar seu estado interno e disparar a animação.
- **Alternativa B**: Remover o `@click` interno do `AnimatedCheckbox` e deixar a responsabilidade de clique inteiramente para o pai, controlando pelo `v-model`. No entanto, isso dificultaria o controle preciso do disparo da animação de comemoração (fogos), já que ela precisa acontecer no momento do clique interativo e não na alteração reativa do `v-model` por fora (ex: ao carregar dados).
- **Raciocínio**: A Alternativa A preserva a independência visual do checkbox enquanto delega a decisão de permitir ou não a marcação ao componente pai (`RoutineCard`).

### Decisão 2: Uso do Quasar Dialog Plugin no RoutineCard
- **Escolha**: Usar `$q.dialog` do Quasar em `RoutineCard.vue` para questionar o usuário se deseja iniciar o treino. Caso sim, executamos `routineStore.resetAllChecklists()`, `workoutStore.startTimer()`, mostramos notificação de sucesso e retornamos `true` para liberar o checkbox. Caso contrário, retorna `false`.

## Risks / Trade-offs

- **[Risco]**: Conflito de cliques em elementos do tipo `label` dentro do `q-item` do Quasar.
  - *Mitigação*: Como o `q-item` tem `tag="label"`, o clique nele repassa o evento para o componente de checkbox filho, que já interceptará a mudança via `beforeToggle`.
