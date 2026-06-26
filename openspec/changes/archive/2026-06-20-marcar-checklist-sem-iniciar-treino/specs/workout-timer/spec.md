## ADDED Requirements

### Requirement: Restrição de Checklist ao Treino Ativo

O sistema SHALL impedir que itens da checklist de tarefas sejam marcados como concluídos se o cronômetro do treino não estiver ativo. O sistema SHALL solicitar confirmação para iniciar o treino caso o usuário tente interagir com um item desmarcado.

#### Scenario: Tentar marcar item da checklist sem treino ativo

- **WHEN** o cronômetro do treino não estiver ativo e o usuário clicar para marcar um item da checklist
- **THEN** o sistema SHALL exibir um diálogo perguntando se deseja iniciar o treino.

#### Scenario: Confirmar início de treino no diálogo

- **WHEN** o usuário confirmar a inicialização do treino no diálogo de confirmação
- **THEN** o sistema SHALL limpar estados de checklists anteriores, iniciar o cronômetro do treino e marcar o item da checklist clicado como concluído.

#### Scenario: Cancelar início de treino no diálogo

- **WHEN** o usuário cancelar a inicialização do treino no diálogo de confirmação
- **THEN** o sistema SHALL manter o cronômetro inativo e o item da checklist desmarcado.
