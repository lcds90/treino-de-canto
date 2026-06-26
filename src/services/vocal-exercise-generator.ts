// src/services/vocal-exercise-generator.ts

export interface VocalNote {
  midi: number;
  frequency: number;
  name: string;
  duration: number; // em segundos
}

export interface VocalRangeInfo {
  name: string;
  minMidi: number;
  maxMidi: number;
  defaultStartMidi: number;
  description: string;
}

export const VOCAL_RANGES: Record<string, VocalRangeInfo> = {
  soprano: {
    name: 'Soprano',
    minMidi: 60, // C4
    maxMidi: 84, // C6
    defaultStartMidi: 64, // E4
    description: 'Voz feminina aguda (C4 a C6)',
  },
  mezzo: {
    name: 'Mezzo-Soprano',
    minMidi: 57, // A3
    maxMidi: 81, // A5
    defaultStartMidi: 60, // C4
    description: 'Voz feminina intermediária (A3 a A5)',
  },
  contralto: {
    name: 'Contralto',
    minMidi: 53, // F3
    maxMidi: 77, // F5
    defaultStartMidi: 57, // A3
    description: 'Voz feminina grave (F3 a F5)',
  },
  tenor: {
    name: 'Tenor',
    minMidi: 48, // C3
    maxMidi: 72, // C5
    defaultStartMidi: 52, // E3
    description: 'Voz masculina aguda (C3 a C5)',
  },
  baritone: {
    name: 'Barítono',
    minMidi: 45, // A2
    maxMidi: 69, // A4
    defaultStartMidi: 48, // C3
    description: 'Voz masculina intermediária (A2 a A4)',
  },
  bass: {
    name: 'Baixo',
    minMidi: 40, // E2
    maxMidi: 64, // E4
    defaultStartMidi: 43, // G2
    description: 'Voz masculina grave (E2 a E4)',
  },
};

// Padrões de semitons para cada tipo de exercício
export const EXERCISE_PATTERNS = {
  vocalize: {
    name: 'Vocalize (Escala de 5 Notas)',
    offsets: [0, 2, 4, 5, 7, 5, 4, 2, 0],
    noteDuration: 0.4,
  },
  melisma: {
    name: 'Melisma (Arpejo + Escala Descendente)',
    offsets: [0, 4, 7, 12, 11, 9, 7, 5, 4, 2, 0],
    noteDuration: 0.3,
  },
};

export const getFrequencyFromMidi = (midi: number): number => {
  return 440 * Math.pow(2, (midi - 69) / 12);
};

const NOTE_NAMES = ['Dó', 'Dó#', 'Ré', 'Ré#', 'Mi', 'Fá', 'Fá#', 'Sol', 'Sol#', 'Lá', 'Lá#', 'Si'];
export const getNoteNameFromMidi = (midi: number): string => {
  const octave = Math.floor(midi / 12) - 1;
  const name = NOTE_NAMES[midi % 12];
  return `${name} ${octave}`;
};

export const generateExerciseNotes = (
  rootMidi: number,
  exerciseType: 'vocalize' | 'melisma',
): VocalNote[] => {
  const pattern = EXERCISE_PATTERNS[exerciseType];
  if (!pattern) return [];

  return pattern.offsets.map((offset) => {
    const midi = rootMidi + offset;
    return {
      midi,
      frequency: getFrequencyFromMidi(midi),
      name: getNoteNameFromMidi(midi),
      duration: pattern.noteDuration,
    };
  });
};

/**
 * Verifica se a sequência inteira cabe dentro dos limites do naipe vocal
 */
export const isExerciseInBounds = (
  rootMidi: number,
  exerciseType: 'vocalize' | 'melisma',
  vocalRangeKey: string,
): boolean => {
  const range = VOCAL_RANGES[vocalRangeKey] || VOCAL_RANGES.tenor;
  const pattern = EXERCISE_PATTERNS[exerciseType];
  if (!range || !pattern) return false;

  const minOffset = Math.min(...pattern.offsets);
  const maxOffset = Math.max(...pattern.offsets);

  return (
    rootMidi + minOffset >= range.minMidi &&
    rootMidi + maxOffset <= range.maxMidi
  );
};
