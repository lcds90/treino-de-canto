# default-lessons-library Specification

## Purpose
TBD - created by archiving change default-lessons-library. Update Purpose after archive.
## Requirements
### Requirement: Exibição do Acervo de Lições Padrões
O sistema SHALL exibir um acervo (biblioteca) de lições de canto pré-definidas para seleção do usuário.

#### Scenario: Visualização do Catálogo do Acervo
- **GIVEN** o usuário está autenticado e na página de rotina
- **WHEN** o usuário clicar no botão "Explorar Acervo" na página de rotina
- **THEN** o sistema SHALL exibir um diálogo modal contendo a listagem das lições padrões disponíveis no acervo (por exemplo: "Aquecimento Vocal", "Controle de Respiração", "Articulação e Dicção").

### Requirement: Visualização de Detalhes da Lição do Acervo
O sistema SHALL permitir que o usuário visualize os detalhes (instruções, checklists e links de mídia) de qualquer lição do acervo antes de importá-la.

#### Scenario: Seleção de uma Lição para Detalhamento
- **GIVEN** o usuário está visualizando a listagem do catálogo
- **WHEN** o usuário selecionar uma lição da lista no catálogo do acervo
- **THEN** o sistema SHALL exibir os detalhes da lição (instruções de treino e checklist) para revisão.

### Requirement: Importação de Lição para a Rotina Personalizada
O sistema SHALL clonar e salvar a lição do acervo como uma nova tarefa na rotina personalizada do usuário autenticado no Firestore.

#### Scenario: Confirmação de Importação de Lição
- **GIVEN** o usuário está visualizando os detalhes de uma lição do acervo
- **WHEN** o usuário clicar no botão "Adicionar à minha Rotina"
- **THEN** o sistema SHALL criar uma cópia da lição contendo título, plataforma, instruções e checklist, posicioná-la no fim da ordenação das tarefas e salvar o documento na coleção `/users/{userId}/routines/` do usuário no Firestore.

### Requirement: Sugestão de Kit Inicial para Rotina Vazia
O sistema SHALL apresentar um atalho de importação rápida de um conjunto básico de lições de treino de canto (Kit Inicial) caso o usuário não possua nenhuma tarefa cadastrada em sua rotina.

#### Scenario: Exibição de CTA em Rotina Vazia
- **GIVEN** o usuário está na página de rotina
- **WHEN** a rotina do usuário for carregada e estiver completamente vazia (zero tarefas)
- **THEN** o sistema SHALL exibir uma ilustração de estado vazio (Empty State) acompanhada de um botão em destaque para "Importar Kit Inicial de Canto".

### Requirement: Rota Administrativa Protegida para Gestão do Acervo
O sistema SHALL restringir o acesso à rota `/admin/acervo` apenas a usuários autenticados com privilégio administrativo (admin).

#### Scenario: Usuário Administrador Acessando Rota
- **GIVEN** o usuário está autenticado e possui privilégio de administrador (registro de admin correspondente no Firestore)
- **WHEN** o usuário tentar acessar a rota `/admin/acervo`
- **THEN** o sistema SHALL permitir a navegação e carregar o Painel de Gerenciamento do Acervo.

#### Scenario: Usuário Comum Acessando Rota Administrativa
- **GIVEN** o usuário está autenticado mas NÃO possui privilégio de administrador
- **WHEN** o usuário tentar acessar a rota `/admin/acervo`
- **THEN** o sistema SHALL bloquear a navegação e redirecionar o usuário para a página inicial com uma mensagem de erro ("Acesso não autorizado").

### Requirement: Gerenciamento (CRUD) de Templates de Lição pelo Administrador
O sistema SHALL fornecer interfaces de criação, edição e exclusão de lições padrões no catálogo do acervo para usuários administradores autorizados.

#### Scenario: Cadastro de Nova Lição no Acervo
- **GIVEN** o usuário está na tela `/admin/acervo` como administrador
- **WHEN** o usuário preencher o formulário com título, plataforma, instruções e itens da checklist e submeter
- **THEN** o sistema SHALL salvar as informações como um novo documento na coleção global `/templates` do Firestore e atualizar a listagem administrativa.

#### Scenario: Edição de Lição no Acervo
- **GIVEN** o usuário está na tela `/admin/acervo` como administrador
- **WHEN** o usuário alterar os dados de uma lição e salvar as alterações
- **THEN** o sistema SHALL atualizar as informações correspondentes na coleção global `/templates` no Firestore.

#### Scenario: Remoção de Lição do Acervo
- **GIVEN** o usuário está na tela `/admin/acervo` como administrador
- **WHEN** o usuário selecionar a opção de remover uma lição e confirmar a operação no diálogo
- **THEN** o sistema SHALL deletar o documento correspondente da coleção global `/templates` no Firestore.

