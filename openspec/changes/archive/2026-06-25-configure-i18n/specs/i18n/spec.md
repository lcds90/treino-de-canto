## ADDED Requirements

### Requirement: Suporte a Múltiplos Idiomas (i18n)

A aplicação DEVERÁ suportar a exibição da interface do usuário em múltiplos idiomas, incluindo Português do Brasil (`pt-BR`), Inglês (`en-US`) e Espanhol (`es`).

#### Scenario: Exibição no idioma ativo

- **GIVEN** que o idioma ativo é o Português do Brasil (`pt-BR`)
- **WHEN** o usuário visualiza qualquer tela da aplicação
- **THEN** todos os textos e rótulos da interface devem ser exibidos em português do Brasil

#### Scenario: Alternância manual de idioma

- **GIVEN** que o usuário está visualizando a aplicação
- **WHEN** o usuário seleciona um novo idioma (ex: `es`) através do seletor de idioma na interface
- **THEN** a aplicação deve atualizar instantaneamente todos os textos da interface para o idioma selecionado (Espanhol neste cenário)

### Requirement: Detecção Automática do Idioma do Usuário

A aplicação DEVERÁ tentar detectar automaticamente o idioma preferencial do usuário com base nas configurações do navegador no primeiro carregamento.

#### Scenario: Detecção bem-sucedida do idioma do navegador

- **GIVEN** que o usuário está acessando a aplicação pela primeira vez
- **WHEN** o idioma preferencial do navegador é `pt-BR`, `en-US` ou `es`
- **THEN** a aplicação deve definir o idioma ativo correspondente automaticamente

#### Scenario: Fallback para idioma não suportado

- **GIVEN** que o usuário está acessando a aplicação pela primeira vez
- **WHEN** o idioma preferencial do navegador for diferente dos suportados (ex: Francês)
- **THEN** a aplicação deve definir o Português do Brasil (`pt-BR`) como idioma padrão

### Requirement: Persistência da Preferência de Idioma Local

A aplicação DEVERÁ persistir a escolha de idioma do usuário localmente para garantir consistência em visitas subsequentes.

#### Scenario: Persistência da preferência salva

- **GIVEN** que o usuário selecionou anteriormente o idioma `es` manualmente
- **WHEN** o usuário fecha e reabre o aplicativo
- **THEN** a aplicação deve carregar a interface diretamente em `es` utilizando a preferência salva no armazenamento local (`localStorage`)

### Requirement: Persistência e Sincronização do Idioma no Firestore

A aplicação DEVERÁ sincronizar a escolha de idioma do usuário autenticado na nuvem com a coleção de configurações (`settings`) do usuário no Firestore, compartilhando a preferência em múltiplos dispositivos.

#### Scenario: Sincronização do idioma com o Firestore após alteração

- **GIVEN** que o usuário está autenticado
- **WHEN** o usuário altera o idioma do aplicativo para `en-US`
- **THEN** a aplicação deve salvar o idioma no Firestore no documento de configurações do usuário em segundo plano

#### Scenario: Carregamento do idioma salvo no Firestore na inicialização

- **GIVEN** que o usuário tem o idioma `es` salvo em suas configurações remotas no Firestore
- **WHEN** o usuário faz login ou abre a aplicação autenticada
- **THEN** o aplicativo deve carregar e aplicar o idioma `es` dinamicamente na UI

### Requirement: Painel de Configurações de Temas Simplificado (ThemeSettings.vue)

O painel de configurações de temas deve ocultar totalmente a edição de textos e focar na escolha de idioma, cores e modo escuro.

#### Scenario: Ausência de campos de texto no painel de configurações

- **GIVEN** que o usuário abre o painel de configurações de temas (`ThemeSettings.vue`)
- **WHEN** o painel renderizar
- **THEN** a interface não deve exibir inputs de texto para título ou descrição, exibindo apenas as opções de cores, o alternador de Modo Escuro e o seletor de idioma

#### Scenario: Troca de idioma a partir do painel de configurações

- **GIVEN** que o usuário está no painel de configurações de temas
- **WHEN** o usuário altera o idioma no dropdown para `en-US`
- **THEN** todo o aplicativo deve atualizar a interface em tempo real e de forma reativa para exibir os textos correspondentes ao inglês

### Requirement: Exibição Dinâmica (Sorteada) de Descrições e Títulos de Treino

A aplicação deve escolher aleatoriamente frases do i18n para exibição da descrição da Home e título do Treino a cada carregamento do app.

#### Scenario: Exibição sorteada de descrição na Home

- **GIVEN** que o usuário está visualizando a tela inicial (`IndexPage.vue`)
- **WHEN** a tela carregar
- **THEN** a descrição exibida deve corresponder a um dos itens do array `appDescription` no dicionário do idioma ativo, sendo selecionado de forma aleatória a cada novo carregamento do aplicativo

#### Scenario: Exibição sorteada do título na tela de treinos

- **GIVEN** que o usuário acessa a página de treinos (`RotinaPage.vue`)
- **WHEN** a tela carregar
- **THEN** o título exibido deve corresponder a um dos itens do array `workoutTitle` no dicionário do idioma ativo, selecionado de forma aleatória

#### Scenario: Exibição de textos estáticos traduzidos

- **GIVEN** que o usuário está navegando no aplicativo e tem o idioma `en-US` configurado
- **WHEN** o usuário visualiza o banner de treinos
- **THEN** os textos do banner e subtítulo do treino devem ser exibidos de forma estática traduzidos conforme o arquivo de tradução do inglês, sem depender de valores cadastrados na store do Pinia ou no banco de dados Firestore
