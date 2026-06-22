import type { RoutineTask } from 'src/components/models';

export const DEFAULT_LESSONS: Omit<RoutineTask, 'id'>[] = [
  {
    title: 'Aquecimento Vocal Rápido 🎙️',
    platform: 'youtube',
    mediaUrl: 'https://www.youtube.com/watch?v=YNqrNqpq6-E',
    instructions: 'Aquecimento rápido focado em relaxamento e ativação da prega vocal. Ideal para dias com pouco tempo ou antes de apresentações/treinos mais longos.',
    checklist: [
      { id: 'aq_1', label: 'Vibração de lábios (trilo) - 2 minutos', done: false },
      { id: 'aq_2', label: 'Vibração de língua (trilo) - 2 minutos', done: false },
      { id: 'aq_3', label: 'Humming suave (som de M com boca fechada) - 1 minuto', done: false },
      { id: 'aq_4', label: 'Sirenes vocais ascendentes/descendentes - 1 minuto', done: false }
    ],
    order: 1
  },
  {
    title: 'Controle de Respiração (Apoio) 💨',
    platform: 'other',
    mediaUrl: '',
    instructions: 'Exercícios focados em controle de fluxo de ar, sustentação e ativação consciente do apoio diafragmático.',
    checklist: [
      { id: 'res_1', label: 'Sopro contínuo no som de S (manter constante) - 5 repetições', done: false },
      { id: 'res_2', label: 'Sopro pulsado no som de X ou F (ritmo rápido) - 3 séries de 30 segundos', done: false },
      { id: 'res_3', label: 'Inalação lenta em 4 tempos, reter por 4, expirar em 8 tempos - 5 repetições', done: false }
    ],
    order: 2
  },
  {
    title: 'Articulação e Dicção 🗣️',
    platform: 'youtube',
    mediaUrl: 'https://www.youtube.com/watch?v=1F_4tM-P0Qc',
    instructions: 'Foco no relaxamento da mandíbula, agilidade dos articuladores (língua, lábios e palato mole) e clareza de pronúncia.',
    checklist: [
      { id: 'art_1', label: 'Massagem suave nas laterais da mandíbula e bochechas', done: false },
      { id: 'art_2', label: 'Treino rápido de trava-línguas (P, T, K acelerados)', done: false },
      { id: 'art_3', label: 'Sons explosivos com consoantes P-T-K alternadas', done: false }
    ],
    order: 3
  },
  {
    title: 'Desaquecimento Vocal (Cool-down) 🍃',
    platform: 'other',
    mediaUrl: '',
    instructions: 'Reduzir o fluxo sanguíneo nas pregas vocais e relaxar a musculatura laríngea após o treino de canto intenso.',
    checklist: [
      { id: 'des_1', label: 'Humming em tons graves e confortáveis (boca fechada) - 2 minutos', done: false },
      { id: 'des_2', label: 'Som de bocejo com suspiro (yawn-sigh) suave - 5 repetições', done: false },
      { id: 'des_3', label: 'Vibração de lábios em glissando descendente - 2 minutos', done: false }
    ],
    order: 4
  }
];
