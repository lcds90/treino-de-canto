## ADDED Requirements

### Requirement: Exibição Correta do Tempo do Cronômetro
O sistema SHALL exibir o tempo de treino formatado corretamente em horas, minutos e segundos. Os minutos e segundos SHALL ser limitados entre 0 e 59.

#### Scenario: Exibição de Tempo com Menos de uma Hora
- **WHEN** o tempo de treino decorrido for de 14 minutos e 22 segundos (862 segundos)
- **THEN** o cronômetro SHALL exibir formatado como `14:22`.

#### Scenario: Exibição de Tempo com Mais de uma Hora
- **WHEN** o tempo de treino decorrido for de 1 hora, 14 minutos e 22 segundos (4462 segundos)
- **THEN** o cronômetro SHALL exibir formatado como `01:14:22`.
