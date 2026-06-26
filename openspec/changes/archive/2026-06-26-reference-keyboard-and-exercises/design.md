# Technical Design: Afinador / Teclado de Referência Embutido E Exercícios

## Context

Os cantores precisam frequentemente de notas de referência e vocalizes para aquecer a voz antes de começarem o treino de canto contido nos cards de rotina. Atualmente, o aplicativo possui suporte para metrônomo animado, autenticação via Firebase e gerenciamento de tarefas/rotinas, mas não oferece nenhuma interação de áudio melódico nativo nem personalização baseada na classificação vocal do cantor.

## Goals / Non-Goals

### Goals
- Implementar um mini-teclado interativo flutuante (1 oitava) de acesso rápido na interface principal para emitir notas de referência.
- Adicionar no `settings-store` e no Firebase Firestore a classificação (naipe) vocal do usuário.
- Desenvolver um gerador dinâmico de exercícios melódicos (vocalizes e melismas) que se adapte ao naipe vocal escolhido.
- Disponibilizar um reprodutor de áudio sintetizado para guiar o usuário na execução desses exercícios.

### Non-Goals
- Criação de um teclado virtual completo multipolifônico com suporte a MIDI externo (limitado a notas simples de referência).
- Gravação e análise de áudio do microfone do usuário para validar se ele está cantando no tom correto (afinador passivo apenas por referência auditiva).

## Architectural Diagram

```mermaid
flowchart TD
    subgraph UI - Vista do Usuário
        ML[MainLayout.vue / Botão Flutuante] -->|Abre| RKB[ReferenceKeyboard.vue]
        RP[RotinaPage.vue] -->|Exibe| VEC[VocalExerciseCard.vue]
        SP[SettingsPage / Perfil] -->|Seleciona| VS[VocalSelector.vue]
    end

    subgraph Estado (Pinia)
        SS[settings-store.ts]
    end

    subgraph Serviços e Áudio
        AS[audio-synthesizer.ts]
        EG[exercise-generator.ts]
        FS[FirebaseSettingsService]
    end

    RKB -->|Toca Nota| AS
    VS -->|Atualiza vocalRange| SS
    SS -->|Debounce & Persistência| FS
    VEC -->|Lê vocalRange| SS
    VEC -->|Requisita Notas| EG
    VEC -->|Toca Sequência| AS
```

## Decisions

### 1. Motor de Áudio: Web Audio API Nativa vs. Biblioteca Externa (Tone.js)
- **Decisão**: Utilizar a **Web Audio API nativa** do navegador por meio de uma classe de serviço helper (`audio-synthesizer.ts`).
- **Razão**: A Tone.js é muito completa mas adiciona peso considerável ao bundle PWA. Como precisamos apenas gerar frequências senoidais limpas com envelopes simples de ganho para evitar cliques (clicks/pops) e tocar sequências curtas de notas, a API nativa atende perfeitamente sem dependências extras.
- **Alternativa Considerada**: Tone.js (descartada para manter o app leve e sem dependências pesadas).

### 2. Geração e Modelagem de Exercícios
- **Decisão**: Modelar os exercícios (vocalizes e melismas) como padrões de deslocamento de semitons (intervalos) em relação a uma nota base. 
- **Razão**: Isso permite transpor facilmente a sequência para qualquer naipe vocal. O gerador calcula as frequências a partir da frequência da nota base correspondente aos limites confortável do naipe vocal selecionado:
  - Soprano: C4 - C6 (tessitura confortável: E4 - G5)
  - Contralto: F3 - F5 (tessitura confortável: A3 - C5)
  - Tenor: C3 - C5 (tessitura confortável: E3 - G4)
  - Baixo: E2 - E4 (tessitura confortável: G2 - B3)
- **Alternativa Considerada**: Carregar arquivos estáticos de áudio pré-gravados em formato MP3 para cada tom (descartada pelo espaço em disco e falta de flexibilidade de andamento e transposição).

### 3. Armazenamento da Classificação Vocal
- **Decisão**: Adicionar o campo `vocalRange` diretamente no `settings-store.ts` integrado.
- **Razão**: O `settings-store` já possui toda a lógica de persistência em LocalStorage combinada com sincronização automática (Firebase Firestore com Debounce). Adicionar a classificação vocal lá simplifica a arquitetura sem criar novas tabelas ou stores complexos.

## Risks / Trade-offs

| Risco | Mitigação |
| :--- | :--- |
| **Bloqueio de Áudio Autoplay**: Navegadores bloqueiam áudio até que haja uma interação direta do usuário. | Inicializar o `AudioContext` da Web Audio API apenas após o primeiro clique do usuário em um botão de áudio ou tecla do piano. |
| **Cliques de áudio (Pops)**: Parar osciladores de áudio abruptamente causa ruídos desagradáveis no fone de ouvido. | Implementar uma curva de rampa de ganho (`linearRampToValueAtTime`) linear ou exponencial (ADSR simples) para suavizar a entrada e a saída do som. |

## Migration Plan

1. **Atualização do Store**: Adicionar `vocalRange` (padrão `'tenor'`) no `settings-store.ts` e tratar sua inicialização e salvamento.
2. **Desenvolvimento do Sintetizador**: Implementar `audio-synthesizer.ts` em `src/services/`.
3. **Criação do Teclado de Referência**: Desenvolver o componente `ReferenceKeyboard.vue` e adicioná-lo ao `MainLayout.vue` como botão flutuante secundário.
4. **Implementação de Exercícios**: Criar `exercise-generator.ts` e o componente de renderização dos exercícios na listagem de rotinas.
