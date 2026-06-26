# vocal-exercises Specification

## Purpose
Esta especificação define o funcionamento dos exercícios dinâmicos e adaptativos de vocalizes e melismas, integrados com sintetizador de piano, controle de andamento (BPM), figuras de silêncio (pausas) para respiração diafragmática e transposição visual de oitava para pauta musical (clave de sol) sem distorção ou corte de layout.

## Requirements
### Requirement: Geração de Exercícios Personalizados
O sistema SHALL disponibilizar exercícios dinâmicos do tipo Vocalize e Melisma cujas notas e tonalidades se adaptem ao naipe vocal configurado pelo usuário.

#### Scenario: Exercício gerado para Soprano
- **GIVEN** que o usuário está com o naipe configurado como "Soprano"
- **WHEN** o usuário inicia um exercício de Vocalize
- **THEN** o sistema SHALL gerar a sequência de notas dentro do limite confortável de Soprano (C4 a A5).

#### Scenario: Exercício gerado para Baixo
- **GIVEN** que o usuário está com o naipe configurado como "Baixo"
- **WHEN** o usuário inicia o mesmo exercício de Vocalize
- **THEN** o sistema SHALL transpor a sequência de notas para o limite confortável de Baixo (E2 a C4).

### Requirement: Reprodução de Áudio Guia com Sintetizador de Piano
O sistema SHALL permitir a reprodução sonora das sequências de exercícios utilizando sintetizador de áudio piano (Web Audio API com harmônicos puros e filtro dinâmico) como guia para o cantor.

#### Scenario: Iniciar reprodução do áudio guia
- **GIVEN** que o card de exercício dinâmico está sendo exibido na página de treino
- **WHEN** o usuário clica no botão "Tocar Guia"
- **THEN** o sistema SHALL reproduzir a sequência de notas harmônicas em tempo real, acompanhando com uma marcação visual da nota atual na partitura (SVG) ou em blocos.

### Requirement: Transposição Visual de Oitava Coerente
O sistema SHALL transpor a melodia inteira de forma uniforme por oitavas (múltiplos de 12 semitons) para que ela seja renderizada de forma centralizada e sem cortes no contêiner SVG da partitura (clave de sol), independentemente de quão grave (Baixo) ou agudo (Soprano) for o naipe selecionado.

#### Scenario: Transposição de escala para baixo
- **GIVEN** que o usuário tem naipe de "Baixo" e o tom base do exercício é G2 (MIDI 43)
- **WHEN** a partitura é gerada na tela
- **THEN** o sistema SHALL somar 2 oitavas (+24 semitons) à melodia inteira, desenhando-a centralizada a partir de G4 (MIDI 67) com a clave de sol, e sem cortar nenhuma nota do layout.

### Requirement: Ritmo de Duração de Notas e Modo Misto
O sistema SHALL permitir a configuração da duração das notas do exercício entre Mínima, Semínima, Colcheia, Semicolcheia e Alternada (Mista), onde o modo misto alterna notas curtas e longas.

#### Scenario: Execução em modo Alternado
- **GIVEN** que o modo "Alternada (Mista)" está ativo
- **WHEN** o exercício é iniciado
- **THEN** o sistema SHALL definir a primeira e última nota como semínimas (sustentação estável) e alternar as notas intermediárias entre semínima e colcheia.

### Requirement: Figuras de Silêncio (Pausas) de Respiração
O sistema SHALL permitir a inclusão de figuras de silêncio (pausas) na pauta de notas e na execução sonora para que o cantor realize a pausa respiratória de forma controlada.

#### Scenario: Exercício com figuras de silêncio ativas
- **GIVEN** que a opção "Incluir Figuras de Silêncio" está ativa no exercício
- **WHEN** o exercício inicia
- **THEN** o sistema SHALL injetar uma pausa musical no pico melódico do padrão (antes do retorno), renderizar o símbolo de pausa correspondente (ex: 𝄽) na pauta, e silenciar o áudio durante aquele tempo.
