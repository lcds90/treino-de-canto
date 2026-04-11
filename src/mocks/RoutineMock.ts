// src/mocks/routineMocks.ts
import type { RoutineTask } from 'src/components/models';

export const SINGING_ROUTINE_MOCKS: Omit<RoutineTask, 'id'>[] = [
  {
    title: "Aquecimento Vocal Básico",
    instructions: "Foco em vibração de lábios e língua. Mantenha o fluxo de ar constante.",
    mediaUrl: "https://www.youtube.com/watch?v=YNqrNqpq6-E",
    platform: "youtube",
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    checklist: [
      { id: "mock_1", label: "Lip Trill - 3 minutos", done: false },
      { id: "mock_2", label: "Sirene suave (Ooh)", done: false }
    ]
  },
  {
    title: "Agilidade com Escala Pentatônica",
    instructions: "Aumente a velocidade gradualmente sem perder a precisão das notas.",
    mediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    platform: "youtube",
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    checklist: [
      { id: "mock_3", label: "Padrão 1 (Lento)", done: false },
      { id: "mock_4", label: "Padrão 1 (Rápido)", done: false }
    ]
  }
];
