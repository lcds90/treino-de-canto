## Why

Atualmente, novos usuários que se cadastram encontram a rotina de treino vazia e precisam criar manualmente cada lição do zero. Fornecer lições pré-definidas e um acervo (biblioteca) de exercícios estruturados simplifica essa inicialização. Além disso, é necessário um local seguro (painel administrativo) com rotas protegidas para permitir a edição, exclusão e criação dessas lições padrões de forma dinâmica (em vez de estática no código), garantindo flexibilidade na gestão do acervo sem novos deploys.

## What Changes

- **Banco de Dados Dinâmico para Acervo**: Migração das lições padrões para uma coleção global do Firebase Firestore (`templates`).
- **Controle de Acesso Administrativo**: Introdução de um sistema de regras baseado em perfil (por exemplo, um documento em `/admins/{userId}` ou checagem de claim/documento de usuário) que define quem pode modificar a coleção `/templates`.
- **Painel Administrativo (`/admin/acervo`)**: Rota segura e restrita no Vue Router que permite a administradores realizar operações CRUD (Criar, Ler, Atualizar, Excluir) nos templates de lições.
- **Interface de Seleção para o Usuário**: Rota de rotina padrão continua consumindo a coleção `/templates` de forma somente leitura, permitindo a importação das lições do acervo para a coleção do usuário.
- **Inserção Rápida de Kit Inicial**: Quando a rotina de um usuário estiver vazia, sugerir a importação automática do Kit Inicial (lido diretamente do Firestore).

## Capabilities

### New Capabilities
- `default-lessons-library`: Mecanismo de acervo de lições no Firestore, interface de catálogo/importação para usuários gerais e auto-sugestão para novas rotinas.
- `default-lessons-admin`: Interface segura de gerenciamento (CRUD) de templates de lições padrões na rota `/admin/acervo`, protegida por controle de privilégios de administrador.

### Modified Capabilities
Nenhuma capability existente sofrerá alteração de regras de negócio. As tarefas importadas do acervo usarão o modelo de dados padrão `RoutineTask` para garantir compatibilidade com as capacidades de treino e cronômetro já existentes.

## Impact

- **Visual Impact & Connections**:
  - Para o usuário comum: Um novo card pontilhado "Explorar Biblioteca" no rodapé da página `RotinaPage` e um modal de catálogo. Um banner de boas-vindas é exibido se a lista estiver vazia.
  - Para administradores: Uma nova rota de administração `/admin/acervo` contendo uma tabela responsiva (datatable) com lista de lições, ações para editar e excluir, e um formulário de cadastro/edição de templates. O fluxo de autenticação e a guarda de rotas (`router.beforeEach`) serão estendidos para verificar o privilégio administrativo.
- **Database (Firestore)**:
  - Nova coleção global `/templates` contendo as lições padrões do acervo.
  - Nova coleção/documento `/admins/{userId}` para registrar de forma segura as UIDs autorizadas a escrever na coleção `/templates`. As Regras de Segurança do Firestore (`firestore.rules`) serão atualizadas para validar esses papéis.
- **Rollback Plan**:
  - Caso haja problemas de segurança ou performance, a rota `/admin/acervo` pode ser desativada no roteador frontend ou a regra do Firestore para escrita em `/templates` pode ser alterada para `allow write: if false;`. O card de atalho na listagem de rotinas pode ser ocultado por uma variável de ambiente ou feature flag.
- **Affected Teams**:
  - **Equipe de Frontend**: Desenvolvimento do painel administrativo, atualização das guardas de rotas do Vue Router e construção do catálogo.
  - **Equipe de Segurança & Infraestrutura (Firebase)**: Configuração das regras do Firestore (`firestore.rules`) e provisionamento da coleção `/admins` para controle de acesso.
