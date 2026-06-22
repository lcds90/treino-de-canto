## Context

A animação do metrônomo foi atualizada para reproduzir um modelo mecânico tradicional de pirâmide. O visualizador é implementado via SVG responsivo e animado programaticamente usando GSAP para obter reações físicas de alta fidelidade baseadas no andamento configurado.

## Goals / Non-Goals

**Goals:**
- Implementar um metrônomo clássico mecânico em SVG.
- Desenvolver a física do braço do pêndulo que oscila suavemente de um lado a outro.
- Implementar a translação vertical do peso mecânico sobre a haste com base na velocidade do BPM (simulando a física de gravidade real de um metrônomo analógico).
- Adicionar efeito de brilho reativo (flash) na placa interna do metrônomo que se adapta às cores do tema do aplicativo.

**Non-Goals:**
- Criar simulações 3D pesadas (WebGL) ou usar imagens estáticas rasterizadas.

## Decisions

### 1. Física e Renderização do Peso Deslizante
- **Decisão**: Criar a propriedade computada `weightY` que interpola o valor de `bpm` na faixa de 40 a 240 para mapear a posição Y do peso no SVG entre `35` (topo, lento) e `105` (base, rápido).
- **Racional**: Oferece alto realismo visual ao simular o ajuste real de gravidade do braço oscilante analógico, dando um feedback tátil e imediato ao usuário quando altera o andamento.

### 2. Oscilação Baseada em seno (`sine.inOut`)
- **Decisão**: Mover a rotação do pêndulo usando a curva `sine.inOut` do GSAP.
- **Racional**: A curva senoidal aproxima-se com perfeição do movimento harmônico de oscilação natural do pêndulo sob força da gravidade, com aceleração e desaceleração graduais antes de inverter o sentido.

### 3. Flash e Modos de Mesclagem
- **Decisão**: Sobrepor um elemento de mesmo formato da placa central em SVG com a propriedade CSS `mix-blend-mode: color-dodge` ou similar, cuja opacidade é animada a cada clique de áudio.
- **Racional**: Cria um efeito de iluminação interna de alta qualidade que herda a cor primária ativa do tema Quasar do usuário.

## Risks / Trade-offs

- **[Risco] Defasagem visual de rotação** → Mudar o BPM enquanto a haste oscila pode causar cortes abruptos na rotação se a animação anterior não for limpa.
  - *Mitigação*: Utilizar `overwrite: "auto"` ao iniciar cada movimento de batida no GSAP para cancelar a interpolação anterior instantaneamente e iniciar o novo arco na velocidade corrigida.
