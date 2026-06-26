## 1. Configuração e Dependências

- [x] 1.1 Adicionar dependência `vue-i18n` no arquivo `package.json`
- [x] 1.2 Instalar as dependências do projeto executando o gerenciador de pacotes apropriado

## 2. Estrutura de Dicionários (Traduções)

- [x] 2.1 Criar o diretório `src/i18n/` e os subdiretórios `pt-BR`, `en-US` e `es`
- [x] 2.2 Criar o arquivo `src/i18n/pt-BR/index.ts` com as mensagens iniciais da interface em português
- [x] 2.3 Criar o arquivo `src/i18n/en-US/index.ts` com as mensagens iniciais da interface em inglês
- [x] 2.4 Criar o arquivo `src/i18n/es/index.ts` com as mensagens iniciais da interface em espanhol
- [x] 2.5 Criar o arquivo de entrada `src/i18n/index.ts` que importa e exporta os dicionários de idioma unificados

## 3. Configuração do Boot no Quasar

- [x] 3.1 Criar o arquivo boot `src/boot/i18n.ts` inicializando a instância do i18n com detecção do idioma do navegador, fallback para `pt-BR`, suporte à persistência no `localStorage` e exportando os helpers funcionais `setLocale` e `getI18n`
- [x] 3.2 Registrar o arquivo boot `'i18n'` na propriedade `boot` do `quasar.config.ts`

## 4. Integração Visual e Tradução de Demonstração

- [x] 4.1 Adicionar o seletor de idioma (dropdown usando `q-menu` e `q-btn` com ícone `translate`) no cabeçalho do layout `src/layouts/MainLayout.vue` com suporte a `pt-BR`, `en-US` e `es`
- [x] 4.2 Internacionalizar os textos estáticos do menu de navegação e cabeçalho no `MainLayout.vue` (por exemplo, "Início", "Rotina", "Metrônomo", "Minha Conta", "Sair")
- [x] 4.3 Adaptar a página de login/registro ou inicial para utilizar os textos traduzidos dinamicamente como exemplo de verificação funcional nos três idiomas

## 5. Verificação e Testes

- [x] 5.1 Rodar a aplicação em modo de desenvolvimento e testar a alternância manual do idioma no cabeçalho, certificando-se de que os textos mudam na hora para todos os três idiomas
- [x] 5.2 Testar a persistência recarregando a página e validando que o idioma escolhido anteriormente é mantido
- [x] 5.3 Testar a detecção automática limpando o `localStorage` e alterando a preferência do idioma do navegador para inglês, espanhol e português
- [x] 5.4 Executar o linter e o formatador para garantir a integridade do código

## 6. Persistência no Firestore, Refatoração de Painel de Temas e Correção de Reatividade

- [x] 6.1 Implementar os helpers funcionais `setLocale` e `getI18n` em `src/boot/i18n.ts` para resolver o bug de live-bindings e reatividade na troca de idioma de fora dos componentes
- [x] 6.2 Modificar `src/stores/settings-store.ts` para usar o helper `setLocale`, evitar chamadas errôneas de salvamento no Firestore para usuários não autenticados e implementar a lógica de computed arrays para `appDescription` e `workoutTitle` sorteados, removendo propriedades de textos da persistência
- [x] 6.3 Sincronizar o seletor em `MainLayout.vue` para chamar a action do `settingsStore.updateLanguage` e ler a propriedade reativa correspondente
- [x] 6.4 Atualizar `src/components/ThemeSettings/ThemeSettings.vue` para remover todos os campos de texto (Home e Treino) e incluir o seletor de idioma integrado com a store `settingsStore`
- [x] 6.5 Atualizar `IndexPage.vue` e `RotinaPage.vue` para remover dependência da store para títulos e subtítulos estáticos, usando traduções estáticas no vue-i18n
- [x] 6.6 Realizar testes de ponta a ponta e garantir a integridade da aplicação livre de erros e warnings
