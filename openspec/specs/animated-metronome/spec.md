# animated-metronome Specification

## Purpose
Esta especificação define o visualizador mecânico clássico e interativo do metrônomo da aplicação, garantindo uma física e animação realistas sincronizadas com o tempo de prática e áudio.
## Requirements
### Requirement: Feedback Visual de Metrônomo Mecânico Tradicional
O sistema SHALL exibir no Modo Execução a representação visual de um metrônomo mecânico clássico em formato piramidal, composto por um corpo de madeira, escala de andamento, haste de metal (pêndulo) e peso deslizante ajustável.

#### Scenario: Movimento Físico do Pêndulo
- **WHEN** o metrônomo estiver ativo no Modo Execução
- **THEN** a haste do pêndulo SHALL oscilar lateralmente em sincronia com as batidas de áudio, alternando a direção a cada batida com uma desaceleração harmônica (`ease: "sine.inOut"`) via GSAP.

#### Scenario: Ajuste Dinâmico do Peso Deslizante (BPM)
- **WHEN** o usuário alterar o valor do BPM no Modo Configuração
- **THEN** a posição vertical do peso metálico na haste do pêndulo SHALL se deslocar fisicamente em tempo real (para cima com BPMs mais baixos, para baixo com BPMs mais altos).

#### Scenario: Efeito de Brilho de Batida (Flash)
- **WHEN** ocorrer o acionamento de uma batida de áudio
- **THEN** a placa frontal do metrônomo SHALL emitir um flash luminoso de cor (usando a cor primária do tema Quasar), desvanecendo rapidamente. O flash SHALL ser mais brilhante e perceptível no tempo forte (Beat 0).

#### Scenario: Parada e Centralização Suave
- **WHEN** a execução do metrônomo for interrompida (Pause, Stop ou Conclusão)
- **THEN** a haste do pêndulo SHALL desacelerar e parar suavemente na posição vertical de repouso (0 graus) via GSAP.

