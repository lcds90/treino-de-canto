## Why

Atualmente, os cantores que utilizam o aplicativo precisam recorrer a ferramentas externas (como pianos virtuais ou afinadores físicos/digitais) para encontrar a nota de referência ou "pegar o tom" antes de iniciar seus treinos. Além disso, o aplicativo carece de personalização de acordo com o naipe vocal do usuário e não oferece exercícios dinâmicos específicos como vocalizes e melismas, limitando a experiência de treino personalizado.

## What Changes

- **Mini-teclado de Referência Flutuante**: Adição de um botão flutuante secundário que abre um mini-teclado interativo (1 oitava) ou toca notas de referência (Dó, Ré, Mi, etc.) usando a Web Audio API.
- **Classificação e Naipe Vocal**: Criação de um seletor de naipe vocal (Soprano, Contralto, Tenor, Baixo, etc.) nas configurações do perfil do usuário.
- **Exercícios de Vocalização e Melisma**: Geração e exibição de exercícios especializados (como vocalizes e melismas) ajustados dinamicamente para o naipe vocal escolhido pelo cantor.

## Capabilities

### New Capabilities

- `reference-keyboard`: Teclado de referência flutuante de uma oitava e afinador para execução de notas de referência sonoras via Web Audio API.
- `vocal-classification`: Cadastro e seleção de classificação vocal (naipe vocal) do cantor, influenciando os tons dos exercícios sugeridos.
- `vocal-exercises`: Módulo de geração e reprodução de exercícios dinâmicos de canto (vocalizes e melismas).

### Modified Capabilities

*(Nenhuma capacidade existente terá seus requisitos alterados. Novas capacidades serão adicionadas de forma modular)*

## Impact

### Afetação de Código e Dependências
- **Web Audio API**: Utilização da API nativa do navegador para geração de frequências sonoras das notas de referência e exercícios de vocalização.
- **Componentes**: Criação do componente de botão flutuante e do modal/teclado de referência.
- **Pinia Stores**: Atualização do `settings-store` ou criação de um novo `vocal-profile-store` para gerenciar a classificação vocal e novos tipos de exercícios.

### Resumo do Impacto Visual e Conexões
- A interface de treino (`RotinaPage`) e a página inicial (`IndexPage`) terão um botão flutuante secundário (ex: no canto inferior direito) que abrirá o mini-teclado de referência de forma não intrusiva.
- A página de configurações/perfil terá uma nova seção para seleção do naipe vocal do cantor, com feedback visual indicando a tessitura aproximada.
- A lista de rotinas integrará os novos exercícios de vocalize e melisma como cards especiais que tocam guias de áudio personalizados.

### Times Afetados
- **Time de Frontend**: Responsável pelo desenvolvimento do mini-teclado flutuante e novos seletores visuais.
- **Time de Design / UX**: Responsável por garantir que o botão flutuante secundário não entre em conflito visual com o botão principal de treino e outros componentes.

### Plano de Rollback
Caso a nova funcionalidade cause instabilidade de áudio no navegador ou problemas de performance:
1. Reverter os commits relacionados à integração do botão flutuante do teclado e novos exercícios.
2. Desativar as novas rotinas de geração de vocalizes nas configurações remotas ou localmente.
3. Garantir que as rotinas padrão (vídeos/aulas estáticas) permaneçam totalmente funcionais sem dependências do módulo de áudio.
