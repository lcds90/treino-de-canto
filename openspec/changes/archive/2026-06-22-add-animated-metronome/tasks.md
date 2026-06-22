## 1. Configuração e Rotas

- [x] 1.1 Adicionar a rota `/metronomo` com a propriedade `meta: { requiresAuth: true }` no arquivo de rotas [routes.ts](file:///home/lcds/projects/rotina-canto/src/router/routes.ts).
- [x] 1.2 Adicionar a nova aba 'Metrônomo' no `linksList` em [MainLayout.vue](file:///home/lcds/projects/rotina-canto/src/layouts/MainLayout.vue), utilizando o ícone `av_timer` e a rota `/metronomo`.

## 2. Interface do Usuário (UI) de Contêiner Único e SVG

- [x] 2.1 Refatorar a página `src/pages/MetronomePage.vue` para usar um único contêiner de card centralizado e responsivo (`max-width: 480px`).
- [x] 2.2 Desenhar o layout da fase de Configuração (presets de tempo, customizados, BPM slider e botão "Iniciar").
- [x] 2.3 Estruturar o visualizador mecânico clássico do metrônomo no formato SVG com o corpo piramidal de madeira, haste, peso e placa de escala.
- [x] 2.4 Integrar o temporizador circular e botões de ação (Som/Mudo, Pause, Stop) na fase de Execução.
- [x] 2.5 Configurar as transições `<transition>` do Vue para alternar de forma suave entre as duas fases.

## 3. Lógica, Áudio e Animações GSAP

- [x] 3.1 Implementar o temporizador regressivo e motor de áudio preciso com Web Audio API look-ahead.
- [x] 3.2 Codificar a propriedade computada `weightY` que calcula a posição vertical do peso com base no BPM.
- [x] 3.3 Desenvolver a animação do braço do pêndulo em GSAP utilizando curvas senoidais (`sine.inOut`) para oscilação harmônica lateral em sincronia com os cliques.
- [x] 3.4 Desenvolver a animação de brilho (flash de opacidade) na placa central reativa de batida com destaque no Beat 0.
- [x] 3.5 Programar o retorno automático ao repouso centralizado dos elementos SVG quando pausado ou parado, e redirecionamento de tela ao concluir.

## 4. Validação e Polimento

- [x] 4.1 Testar a responsividade e o redimensionamento do SVG mecânico em telas menores.
- [x] 4.2 Validar a estabilidade de desempenho em BPMs elevados (ex: 200+ BPM), sem travamentos.
- [x] 4.3 Verificar se o visualizador adota e atualiza instantaneamente as cores do tema Quasar do usuário.
