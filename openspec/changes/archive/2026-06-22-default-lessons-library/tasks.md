## 1. Regras de Segurança e Banco de Dados (Firestore)

- [x] 1.1 Atualizar `firestore.rules` para restringir a escrita na coleção `/templates` apenas a UIDs presentes na coleção `/admins`.
- [x] 1.2 Criar um script ou script de mock para semear a coleção global `/templates` com as primeiras lições padrões de teste.
- [x] 1.3 Criar a estrutura do documento correspondente em `/admins/{userId}` para habilitar o primeiro usuário de teste como administrador local.

## 2. Roteamento e Guarda de Rotas Segura

- [x] 2.1 Adicionar a rota `/admin/acervo` no Vue Router (`src/router/routes.ts`) com metadados `{ requiresAuth: true, requiresAdmin: true }`.
- [x] 2.2 Atualizar a guarda de rota global (`src/router/index.ts`) para verificar as credenciais administrativas em rotas com `requiresAdmin`. Redirecionar para `/` caso o usuário seja comum.

## 3. Lógica de Negócio e Stores (Pinia & Services)

- [x] 3.1 Atualizar `src/stores/auth-store.ts` para buscar o estado de administrador (`isAdmin`) da coleção do Firestore `/admins/{uid}` após a inicialização da sessão e guardá-lo em cache.
- [x] 3.2 Criar o serviço `FirebaseTemplateService` em `src/services/firebase/TemplateService.ts` contendo as chamadas do CRUD de templates do acervo global.
- [x] 3.3 Registrar o serviço de templates em `src/services/index.ts`.
- [x] 3.4 Atualizar `src/stores/routine-store.ts` com as ações `fetchTemplates` (carregar acervo), `importTaskFromTemplate` (clonar template na rotina do usuário) e `importInitialKit` (carregar kit básico na rotina vazia).
- [x] 3.5 Criar ou estender ações na store para permitir operações CRUD administrativas (`createTemplate`, `updateTemplate`, `deleteTemplate`) chamando o novo serviço de templates.

## 4. UI do Usuário (Catálogo, Card de Acesso e Empty State)

- [x] 4.1 Criar o card de entrada `src/components/RoutineLibraryCard.vue` com design pontilhado e animação GSAP.
- [x] 4.2 Inserir o card de entrada no rodapé de `src/components/RoutineList.vue` ao lado do card de nova rotina manual.
- [x] 4.3 Criar o modal `src/components/LibraryCatalogDialog.vue` para exibir a listagem de lições de canto disponíveis no acervo para importação do usuário comum.
- [x] 4.4 Implementar o layout premium de Empty State em `src/components/RoutineList.vue` (quando a lista do usuário estiver vazia), oferecendo botões de "Importar Kit Inicial" e "Explorar Acervo".

## 5. UI de Administração (CRUD de Templates)

- [x] 5.1 Criar a página de administração `src/pages/AdminAcervoPage.vue` contendo tabela de templates cadastrados, com botões para adicionar, editar e remover lições.
- [x] 5.2 Desenvolver o formulário modal administrativo para cadastrar/editar templates (incluindo gerenciamento dinâmico dos itens da checklist de tarefas e plataforma).
- [x] 5.3 Adicionar link visível para a rota administrativa no cabeçalho ou menu lateral apenas para usuários identificados como admin.

## 6. Testes e Validação de Fluxo Seguro

- [x] 6.1 Validar se usuários comuns são bloqueados tanto na navegação do Vue Router quanto pelas regras de segurança do Firestore.
- [x] 6.2 Testar o fluxo completo de gerenciamento (adicionar novo template no acervo, editar e deletar) com usuário administrador.
- [x] 6.3 Validar a importação correta de templates de lições para a rotina de usuários normais.
