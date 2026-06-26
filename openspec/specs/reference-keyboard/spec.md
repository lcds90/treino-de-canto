# reference-keyboard Specification

## Purpose
Esta especificação define o teclado de referência embutido, atalhos do teclado do computador e integração MIDI, permitindo que os cantores encontrem notas de referência e treinem com suporte a controladores físicos de hardware e atalhos rápidos com feedback visual dinâmico.

## Requirements
### Requirement: Botão Flutuante de Acesso ao Teclado
O sistema SHALL disponibilizar um botão flutuante secundário na interface principal (disponível na página de treino `/treino`) que permita abrir e fechar o mini-teclado de referência.

#### Scenario: Abrir o mini-teclado
- **GIVEN** que o usuário está autenticado e na página de treino
- **WHEN** o usuário clica no botão flutuante de nota/afinador (ícone de piano)
- **THEN** o sistema SHALL exibir o painel do mini-teclado de referência de forma sobreposta (popup flutuante).

#### Scenario: Fechar o mini-teclado
- **GIVEN** que o painel do mini-teclado está aberto
- **WHEN** o usuário clica fora do painel ou realiza ações de navegação
- **THEN** o sistema SHALL ocultar o painel do mini-teclado de referência.

### Requirement: Teclado de Referência e Alcance Vocal
O sistema SHALL renderizar um teclado de piano interativo de 2 oitavas, destacando as teclas correspondentes ao alcance vocal do usuário e permitindo a mudança de oitavas rápida.

#### Scenario: Tocar nota de referência ao clicar em tecla do piano
- **GIVEN** que o painel do teclado está aberto
- **WHEN** o usuário clica na tecla correspondente a uma nota
- **THEN** o sistema SHALL reproduzir o som senoidal harmônico (timbre de piano) utilizando a Web Audio API e destacar visualmente a tecla pressionada.

#### Scenario: Alterar oitava ativa
- **GIVEN** que o teclado de referência está aberto
- **WHEN** o usuário altera a oitava ativa pelos controles de oitava
- **THEN** o sistema SHALL deslocar a faixa de notas visíveis do teclado de piano para a nova oitava selecionada.

### Requirement: Atalhos do Teclado do Computador (QWERTY)
O sistema SHALL permitir o acionamento de notas por atalhos no teclado do computador físico, exibindo guias visuais com cantos arredondados (keycaps) nas teclas virtuais correspondentes.

#### Scenario: Tocar nota por atalho QWERTY
- **GIVEN** que o teclado de referência está em foco/ativo
- **WHEN** o usuário pressiona a tecla 'A' no teclado físico do computador
- **THEN** o sistema SHALL reproduzir a nota correspondente (Dó) e piscar visualmente a tecla virtual na tela.

### Requirement: Integração Web MIDI
O sistema SHALL se conectar à API de Web MIDI do navegador, permitindo a execução de notas por controladores de teclado físicos conectados via USB.

#### Scenario: Tocar nota através de teclado controlador físico
- **GIVEN** que um dispositivo MIDI está conectado ao computador
- **WHEN** o usuário pressiona uma tecla física no teclado controlador
- **THEN** o sistema SHALL detectar a mensagem MIDI noteOn, destacar a tecla correspondente na tela e reproduzir o som de piano.
