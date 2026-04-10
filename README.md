# 🎤 Rotina de Canto - Painel de Evolução Vocal

Um aplicativo moderno e gamificado projetado para auxiliar cantores e estudantes de música a acompanharem suas rotinas de exercícios vocais. A plataforma oferece acompanhamento de performance, histórico de treinos e um painel de métricas motivacional inspirado em grandes apps de aprendizado contínuo (como o Duolingo).

## ✨ Principais Funcionalidades

* **📺 Player de Treino Integrado:** Suporte nativo para links do YouTube (auto-formatação de links convencionais, *embeds* e mobile) para guiar os exercícios vocais.
* **📝 Checklist de Exercícios:** Marcação granular de tarefas permitindo que o sistema identifique treinos "Completos", "Parciais" ou "Não Feitos".
* **🔥 Dashboard Gamificado:**
  * **Ofensiva (Streak):** Contagem de dias consecutivos de treino.
  * **Recorde Pessoal (Best Day):** Identificação e destaque do dia com a melhor performance (troféu 🏆).
  * **Gráfico de Desempenho:** Acompanhamento visual da semana utilizando **ApexCharts**, segmentado por status de conclusão.
* **🎨 Motor de Temas Customizável:**
  * Interface para alteração do **Dark Mode**.
  * Customização em tempo real das cores da paleta do Quasar (Primary, Secondary, Positive, etc.).
  * Edição dinâmica de textos, títulos e mensagens motivacionais da aplicação.
* **☁️ Sincronização em Nuvem Inteligente:** Uso de LocalStorage para resposta instantânea na UI (Offline-first) em conjunto com **Firebase Firestore**, utilizando técnica de *Debounce* para economizar leituras/escritas no banco de dados.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído sobre as melhores e mais modernas ferramentas do ecossistema front-end:

* **[Vue.js 3](https://vuejs.org/)** (Composition API & `<script setup>`)
* **[Quasar Framework](https://quasar.dev/)** (UI Components, Layouts e Design System)
* **[Pinia](https://pinia.vuejs.org/)** (Gerenciamento de Estado)
* **[Firebase / Firestore](https://firebase.google.com/)** (Banco de dados NoSQL e BaaS)
* **[GSAP](https://gsap.com/)** (Animações complexas e transições de interface)
* **[ApexCharts](https://apexcharts.com/)** (Gráficos interativos de performance)

## 🏗️ Arquitetura do Projeto

O código segue os princípios de *Single Responsibility* (Responsabilidade Única) e separação de camadas, garantindo alta escalabilidade:

* `src/components/`: Componentes visuais isolados (ex: `PerformanceChart.vue`, `BestDayCard.vue`).
* `src/pages/`: Orquestradores de layout (ex: `HomePage.vue`, `RotinaPage.vue`).
* `src/stores/`: Lógica de estado global dividida por domínio (`routine-store`, `workout-store`, `metrics-store`, `settings-store`).
* `src/services/`: Camada de comunicação com APIs externas e regras de negócio pesadas (ex: `FirebaseSettingsService`, `MetricsService`).

## 🚀 Como Executar o Projeto

### Pré-requisitos
* Node.js instalado (v18+ recomendado)
* Quasar CLI (`npm install -g @quasar/cli`)
* Um projeto configurado no [Firebase](https://console.firebase.google.com/)

### Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/rotina-de-canto.git
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd rotina-de-canto
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Configure as variáveis de ambiente do Firebase no arquivo `src/boot/firebase.ts`.

### Rodando em Desenvolvimento

Inicie o servidor de desenvolvimento do Quasar:

```bash
quasar dev
```
O aplicativo estará disponível em `http://localhost:9000`.

### Build para Produção

Para compilar o aplicativo para produção (SPA):

```bash
quasar build
```

---
*Desenvolvido com foco na disciplina, técnica e código limpo.* 🎶💻