## 1. Modificação do Componente de Checkbox

- [x] 1.1 Adicionar propriedade `beforeToggle` (como Function, default null) ao `AnimatedCheckbox.vue`
- [x] 1.2 Atualizar método `toggleChecked` no `AnimatedCheckbox.vue` para aguardar o callback assíncrono `beforeToggle` antes de prosseguir com a marcação e animação

## 2. Implementação das Regras no Card de Rotina

- [x] 2.1 Importar `useQuasar`, `useWorkoutStore` e `useRoutineStore` no `RoutineCard.vue`
- [x] 2.2 Implementar a função `beforeChecklistToggle` no `RoutineCard.vue` para verificar se o treino está ativo e exibir o diálogo de confirmação do Quasar
- [x] 2.3 Atualizar o template do `RoutineCard.vue` para passar `:beforeToggle="beforeChecklistToggle"` para o `AnimatedCheckbox`
