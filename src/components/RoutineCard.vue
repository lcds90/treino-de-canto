<template>
  <q-card class="routine-card shadow-4 text-left" bordered>
    <q-card-section class="bg-accent text-white row items-center justify-between">
      <div class="row items-center">
        <q-btn
          v-if="!readOnly"
          ref="orderBtnRef"
          flat
          round
          dense
          icon="drag_indicator"
          color="white"
          class="action-btn drag-handle"
          @click="handleDuplicate"
        >
          <q-tooltip>Ordenar Rotina</q-tooltip>
        </q-btn>

        <!-- Checkbox de Conclusão da Rotina -->
        <AnimatedCheckbox
          v-model="localDone"
          :beforeToggle="beforeChecklistToggle"
          class="q-mr-sm"
          :class="{ 'pointer-events-none': readOnly }"
          style="--q-primary: rgba(255, 255, 255, 0.7); --q-checked: #4caf50; width: 24px; min-width: 24px; min-height: 24px;"
        />

        <div class="text-h6 text-weight-bold" :style="localDone ? 'text-decoration: line-through; opacity: 0.8;' : ''">
          {{ task.title }}
          <q-badge
            color="white"
            text-color="secondary"
            class="q-ml-sm text-weight-bold"
            align="middle"
          >
            {{ task.order || 1 }} / {{ totalTasks }}
          </q-badge>
        </div>
      </div>

      <div class="row justify-between q-gutter-x-sm">
        <q-btn
          ref="copyBtnRef"
          flat
          round
          dense
          :icon="readOnly ? 'add' : 'content_copy'"
          color="white"
          class="action-btn"
          @click="handleDuplicate"
        >
          <q-tooltip>
            {{ readOnly ? 'Adicionar esta rotina à meu treino atual' : 'Duplicar rotina' }}
          </q-tooltip>
        </q-btn>

        <q-btn
          v-if="!readOnly"
          ref="editBtnRef"
          flat
          round
          dense
          icon="edit"
          color="white"
          class="action-btn"
          @click="handleEdit"
        >
          <q-tooltip>Editar Rotina</q-tooltip>
        </q-btn>

        <q-btn
          v-if="!readOnly"
          ref="deleteBtnRef"
          flat
          round
          dense
          icon="delete"
          color="white"
          class="action-btn"
          @click="handleDelete"
        >
          <q-tooltip>Excluir Rotina</q-tooltip>
        </q-btn>
      </div>
    </q-card-section>

    <q-video v-if="task.platform === 'youtube'" :src="getEmbedUrl(task.mediaUrl)" :ratio="16 / 9" />

    <!-- Player de Exercício Vocal Dinâmico (Vocalize e Melisma) -->
    <div v-else-if="task.platform === 'vocalize' || task.platform === 'melisma'" class="vocalize-player-container q-pa-md text-center bg-grey-1" :class="{ 'dark-player bg-grey-10': $q.dark.isActive }">
      <div class="row justify-center items-center q-mb-md">
        <q-icon
          :name="task.platform === 'vocalize' ? 'graphic_eq' : 'waves'"
          size="3rem"
          color="secondary"
          class="q-mr-sm"
        />
        <div class="text-left">
          <div class="text-h6 text-weight-bold text-secondary">
            {{ task.platform === 'vocalize' ? 'Exercício de Vocalize' : 'Exercício de Melisma' }}
          </div>
          <div class="text-caption text-grey-7">
            Ajustado para o seu naipe vocal: <strong class="text-primary text-capitalize">{{ settingsStore.vocalRange }}</strong>
          </div>
        </div>
      </div>

      <!-- Informações Musicais (BPM e Duração da Nota) -->
      <div class="row justify-center items-center q-col-gutter-sm q-mb-sm">
        <div class="col-12 col-sm-6 row justify-center q-gutter-xs">
          <q-badge color="purple" outline class="text-weight-bold">
            BPM: {{ task.bpm || 120 }} 𝄾
          </q-badge>
          <q-badge color="orange" outline class="text-weight-bold">
            Nota: {{ getNoteDurationLabel(task.noteDuration) }}
          </q-badge>
        </div>
        <div v-if="isPlaying && currentNoteIndex !== null" class="col-12 col-sm-6 text-subtitle2 text-weight-bold text-primary">
          Nota: {{ currentNoteIndex + 1 }} / {{ exerciseNotes.length }}
        </div>
      </div>

      <!-- Alternador de Visão (Bloco vs Partitura) -->
      <div class="row justify-end q-mb-xs">
        <q-btn-toggle
          v-model="viewMode"
          dense
          toggle-color="primary"
          :options="[
            { label: 'Partitura 𝄞', value: 'score' },
            { label: 'Blocos 🟦', value: 'blocks' }
          ]"
          flat
          rounded
          class="bg-grey-2 text-grey-8"
          style="font-size: 11px"
        />
      </div>

      <!-- Exibição Visual das Notas do Exercício -->
      <div class="exercise-notes-strip row justify-center q-my-md">
        <!-- Alternar entre Blocos ou Partitura -->
        <template v-if="viewMode === 'blocks'">
          <q-chip
            v-for="(n, idx) in exerciseNotes"
            :key="idx"
            :color="n.isRest ? (currentNoteIndex === idx ? 'purple' : 'grey-4') : (currentNoteIndex === idx ? 'secondary' : 'grey-3')"
            :text-color="currentNoteIndex === idx ? 'white' : 'grey-9'"
            :class="{ 'pulse-active': currentNoteIndex === idx, 'text-weight-bold': true }"
            outline
            square
            size="sm"
          >
            {{ n.isRest ? '𝄾 Pausa' : n.name }}
          </q-chip>
        </template>
        
        <template v-else>
          <div class="full-width q-px-sm" style="overflow-x: auto;">
            <svg viewBox="0 0 500 120" class="full-width" style="min-width: 450px; height: 120px; color: var(--q-primary);" :class="{ 'text-white': $q.dark.isActive }">
              <!-- Linhas da Partitura -->
              <line x1="10" y1="30" x2="490" y2="30" stroke="currentColor" stroke-width="1" opacity="0.35" />
              <line x1="10" y1="40" x2="490" y2="40" stroke="currentColor" stroke-width="1" opacity="0.35" />
              <line x1="10" y1="50" x2="490" y2="50" stroke="currentColor" stroke-width="1" opacity="0.35" />
              <line x1="10" y1="60" x2="490" y2="60" stroke="currentColor" stroke-width="1" opacity="0.35" />
              <line x1="10" y1="70" x2="490" y2="70" stroke="currentColor" stroke-width="1" opacity="0.35" />

              <!-- Linhas de Início e Fim do Compasso -->
              <line x1="10" y1="30" x2="10" y2="70" stroke="currentColor" stroke-width="2" opacity="0.6" />
              <line x1="490" y1="30" x2="490" y2="70" stroke="currentColor" stroke-width="2" opacity="0.6" />

              <!-- Clave de Sol -->
              <text x="15" y="68" font-size="44" font-family="serif" fill="currentColor" opacity="0.8">𝄞</text>

              <!-- Notas Musicais -->
              <g v-for="(n, idx) in exerciseNotes" :key="idx">
                <!-- Se for uma pausa (silêncio) -->
                <template v-if="n.isRest">
                  <text
                    :x="getNoteX(idx, exerciseNotes.length) - 8"
                    y="60"
                    font-size="34"
                    font-family="serif"
                    :fill="currentNoteIndex === idx ? 'var(--q-secondary)' : 'currentColor'"
                    opacity="0.8"
                  >
                    {{ getRestSymbol(n.duration) }}
                  </text>
                </template>

                <!-- Se for uma nota cantada -->
                <template v-else>
                  <!-- Linhas suplementares inferiores -->
                  <line
                    v-if="getStaffY(n.midi) >= 80"
                    :x1="getNoteX(idx, exerciseNotes.length) - 10"
                    y1="80"
                    :x2="getNoteX(idx, exerciseNotes.length) + 10"
                    y2="80"
                    :stroke="currentNoteIndex === idx ? 'var(--q-secondary)' : 'currentColor'"
                    stroke-width="1.2"
                  />
                  <line
                    v-if="getStaffY(n.midi) >= 90"
                    :x1="getNoteX(idx, exerciseNotes.length) - 10"
                    y1="90"
                    :x2="getNoteX(idx, exerciseNotes.length) + 10"
                    y2="90"
                    :stroke="currentNoteIndex === idx ? 'var(--q-secondary)' : 'currentColor'"
                    stroke-width="1.2"
                  />
                  <line
                    v-if="getStaffY(n.midi) >= 100"
                    :x1="getNoteX(idx, exerciseNotes.length) - 10"
                    y1="100"
                    :x2="getNoteX(idx, exerciseNotes.length) + 10"
                    y2="100"
                    :stroke="currentNoteIndex === idx ? 'var(--q-secondary)' : 'currentColor'"
                    stroke-width="1.2"
                  />

                  <!-- Linhas suplementares superiores -->
                  <line
                    v-if="getStaffY(n.midi) <= 20"
                    :x1="getNoteX(idx, exerciseNotes.length) - 10"
                    y1="20"
                    :x2="getNoteX(idx, exerciseNotes.length) + 10"
                    y2="20"
                    :stroke="currentNoteIndex === idx ? 'var(--q-secondary)' : 'currentColor'"
                    stroke-width="1.2"
                  />
                  <line
                    v-if="getStaffY(n.midi) <= 10"
                    :x1="getNoteX(idx, exerciseNotes.length) - 10"
                    y1="10"
                    :x2="getNoteX(idx, exerciseNotes.length) + 10"
                    y2="10"
                    :stroke="currentNoteIndex === idx ? 'var(--q-secondary)' : 'currentColor'"
                    stroke-width="1.2"
                  />

                  <!-- Acidente Sharp (♯) -->
                  <text
                    v-if="hasSharp(n.midi)"
                    :x="getNoteX(idx, exerciseNotes.length) - 14"
                    :y="getStaffY(n.midi) + 4.5"
                    font-size="14"
                    font-weight="bold"
                    :fill="currentNoteIndex === idx ? 'var(--q-secondary)' : 'currentColor'"
                  >♯</text>

                  <!-- Cabeça da Nota (Elipse Rotacionada) -->
                  <ellipse
                    :cx="getNoteX(idx, exerciseNotes.length)"
                    :cy="getStaffY(n.midi)"
                    rx="6"
                    ry="4.2"
                    :transform="`rotate(-20 ${getNoteX(idx, exerciseNotes.length)} ${getStaffY(n.midi)})`"
                    :fill="currentNoteIndex === idx ? 'var(--q-secondary)' : 'currentColor'"
                  />

                  <!-- Haste da Nota para Cima (y > 50) -->
                  <line
                    v-if="getStaffY(n.midi) > 50"
                    :x1="getNoteX(idx, exerciseNotes.length) + 5.5"
                    :y1="getStaffY(n.midi)"
                    :x2="getNoteX(idx, exerciseNotes.length) + 5.5"
                    :y2="getStaffY(n.midi) - 25"
                    :stroke="currentNoteIndex === idx ? 'var(--q-secondary)' : 'currentColor'"
                    stroke-width="1.5"
                  />
                  <!-- Haste da Nota para Baixo (y <= 50) -->
                  <line
                    v-if="getStaffY(n.midi) <= 50"
                    :x1="getNoteX(idx, exerciseNotes.length) - 5.5"
                    :y1="getStaffY(n.midi)"
                    :x2="getNoteX(idx, exerciseNotes.length) - 5.5"
                    :y2="getStaffY(n.midi) + 25"
                    :stroke="currentNoteIndex === idx ? 'var(--q-secondary)' : 'currentColor'"
                    stroke-width="1.5"
                  />
                </template>
              </g>
            </svg>
          </div>
        </template>
      </div>

      <!-- Controles do Exercício -->
      <div class="row items-center justify-center q-gutter-sm">
        <q-btn
          flat
          round
          dense
          color="grey-7"
          icon="remove"
          @click="changeRootMidi(-1)"
          :disabled="isPlaying || !canShiftDown"
        >
          <q-tooltip>Descer Meio Tom</q-tooltip>
        </q-btn>
        
        <q-chip color="primary" text-color="white" class="text-weight-bolder">
          Tom Base: {{ rootNoteName }}
        </q-chip>

        <q-btn
          flat
          round
          dense
          color="grey-7"
          icon="add"
          @click="changeRootMidi(1)"
          :disabled="isPlaying || !canShiftUp"
        >
          <q-tooltip>Subir Meio Tom</q-tooltip>
        </q-btn>
      </div>

      <div class="row justify-center q-mt-md">
        <q-btn
          :color="isPlaying ? 'negative' : 'secondary'"
          :icon="isPlaying ? 'stop' : 'play_arrow'"
          :label="isPlaying ? 'Parar Guia' : 'Tocar Guia'"
          @click="togglePlay"
          rounded
          unelevated
          class="q-px-lg"
        />
      </div>
    </div>

    <q-card-section
      v-else
      class="text-center q-py-xl flex flex-center column"
      style="min-height: 200px"
    >
      <q-icon
        :name="getPlatformIcon(task.platform)"
        size="4rem"
        :color="getPlatformColor(task.platform)"
        class="q-mb-sm"
      />
      <div class="text-subtitle1 text-weight-medium q-mb-md">
        Esta aula está hospedada na <strong>{{ getPlatformName(task.platform) }}</strong>
      </div>
      <q-btn
        :href="task.mediaUrl"
        target="_blank"
        :color="getPlatformColor(task.platform)"
        icon-right="open_in_new"
        label="Acessar Aula"
        rounded
        unelevated
        class="shadow-2"
      />
    </q-card-section>

    <q-card-section>
      <div class="text-subtitle2 text-primary q-mb-sm">📝 Instruções:</div>
      <p class="text-body1">
        {{ task.instructions }}
      </p>
    </q-card-section>


    <q-separator v-if="task.createdAt || task.updatedAt" />
    <q-card-section
      v-if="task.createdAt || task.updatedAt"
      class="q-py-sm row justify-between text-caption"
    >
      <div v-if="task.createdAt" class="row items-center">
        <q-icon name="event" class="q-mr-xs" size="xs" />
        Criado em: {{ formatDate(task.createdAt) }}
      </div>
      <div v-if="task.updatedAt" class="row items-center text-right">
        <q-icon name="update" class="q-mr-xs" size="xs" />
        Atualizado: {{ formatDate(task.updatedAt) }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import gsap from 'gsap';
import AnimatedCheckbox from './AnimatedCheckbox.vue';
import type { RoutineTask, PlatformType } from './models';
import { useQuasar } from 'quasar';
import { useWorkoutStore } from 'src/stores/workout-store';
import { useRoutineStore } from 'src/stores/routine-store';
import { useSettingsStore } from 'src/stores/settings-store';
import { generateExerciseNotes, VOCAL_RANGES, isExerciseInBounds, getNoteNameFromMidi } from 'src/services';
import { audioSynthesizer } from 'src/services/audio-synthesizer';

const props = defineProps<{
  task: RoutineTask;
  totalTasks: number;
  readOnly: boolean;
}>();

const emit = defineEmits(['edit', 'delete', 'duplicate']);

const $q = useQuasar();
const workoutStore = useWorkoutStore();
const routineStore = useRoutineStore();
const settingsStore = useSettingsStore();

const localDone = computed({
  get() {
    return !!props.task.done;
  },
  set(val: boolean) {
    const storeTask = routineStore.tasks.find((t) => t.id === props.task.id);
    if (storeTask) {
      storeTask.done = val;
    } else {
      const taskObj = props.task as any;
      taskObj.done = val;
    }
  },
});

const vocalRangeInfo = computed(() => {
  return VOCAL_RANGES[settingsStore.vocalRange] || VOCAL_RANGES.tenor;
});

const rootMidi = ref(vocalRangeInfo.value?.defaultStartMidi ?? 60);

watch(
  () => settingsStore.vocalRange,
  (newRange) => {
    const info = VOCAL_RANGES[newRange] || VOCAL_RANGES.tenor;
    if (info) {
      rootMidi.value = info.defaultStartMidi;
    }
  }
);

const rootNoteName = computed(() => {
  return getNoteNameFromMidi(rootMidi.value).split(' ')[0];
});

const exerciseNotes = computed(() => {
  const baseNotes = generateExerciseNotes(rootMidi.value, props.task.platform as 'vocalize' | 'melisma');
  const bpm = props.task.bpm || 120;
  const beatSec = 60 / bpm;
  const type = props.task.noteDuration || 'quarter';

  const mappedNotes = baseNotes.map((n, idx) => {
    let duration = beatSec;
    if (type === 'half') {
      duration = beatSec * 2;
    } else if (type === 'eighth') {
      duration = beatSec * 0.5;
    } else if (type === 'sixteenth') {
      duration = beatSec * 0.25;
    } else if (type === 'mixed') {
      // Mistura Semínima (1 tempo) e Colcheia (0.5 tempo) alternadas.
      // A primeira e última nota são semínimas para melhor sustentação e estabilidade.
      if (idx === 0 || idx === baseNotes.length - 1) {
        duration = beatSec; // Semínima
      } else {
        duration = idx % 2 === 0 ? beatSec : beatSec * 0.5; // Semínima ou Colcheia
      }
    }
    return {
      ...n,
      duration,
      isRest: false,
    };
  });

  if (props.task.includeRests) {
    const result: typeof mappedNotes = [];
    const middleIndex = Math.floor(mappedNotes.length / 2) - 1; // Coloca a pausa logo antes da nota de retorno do pico para respirar!
    mappedNotes.forEach((n, idx) => {
      result.push(n);
      if (idx === middleIndex) {
        result.push({
          midi: 0,
          frequency: 0,
          name: 'Pausa',
          duration: type === 'mixed' ? beatSec * 0.5 : n.duration,
          isRest: true,
        });
      }
    });
    return result;
  }

  return mappedNotes;
});

const viewMode = ref<'blocks' | 'score'>('score');

const getNoteX = (index: number, total: number) => {
  return 70 + (400 / (total - 1 || 1)) * index;
};

const getStaffY = (midi: number) => {
  // Transposição visual coerente: calcula um desvio de oitavas baseado no rootMidi
  // para que a melodia toda caiba confortavelmente na clave de sol, na faixa [57, 68]
  let octaveShift = 0;
  let tempRoot = rootMidi.value;
  while (tempRoot < 57) {
    tempRoot += 12;
    octaveShift += 12;
  }
  while (tempRoot > 68) {
    tempRoot -= 12;
    octaveShift -= 12;
  }

  const visualMidi = midi + octaveShift;
  const pcToDiatonic = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
  const pc = visualMidi % 12;
  const octave = Math.floor(visualMidi / 12) - 1;
  const diatonicIndex = octave * 7 + pcToDiatonic[pc];

  // Ref G4 (MIDI 67) -> 2ª linha -> y=60
  const refDiatonic = 4 * 7 + 4;
  const diff = diatonicIndex - refDiatonic;
  return 60 - diff * 5;
};

const hasSharp = (midi: number) => {
  const pc = midi % 12;
  return [1, 3, 6, 8, 10].includes(pc);
};

const getNoteDurationLabel = (type?: string) => {
  if (type === 'half') return 'Mínima 𝅗𝅥';
  if (type === 'eighth') return 'Colcheia 𝅘𝅥𝅮';
  if (type === 'sixteenth') return 'Semicolcheia 𝅘𝅥𝅯';
  if (type === 'mixed') return 'Alternada (Mista) 𝅘𝅥𝅘𝅥𝅮';
  return 'Semínima 𝅘𝅥';
};

const getRestSymbol = (duration: number) => {
  const bpm = props.task.bpm || 120;
  const beatSec = 60 / bpm;
  if (duration >= beatSec * 1.5) return '𝄼'; // Pausa de Mínima
  if (duration <= beatSec * 0.3) return '𝄿'; // Pausa de Semicolcheia
  if (duration <= beatSec * 0.7) return '𝄾'; // Pausa de Colcheia
  return '𝄽'; // Pausa de Semínima
};


const canShiftUp = computed(() => {
  return isExerciseInBounds(rootMidi.value + 1, props.task.platform as 'vocalize' | 'melisma', settingsStore.vocalRange);
});

const canShiftDown = computed(() => {
  return isExerciseInBounds(rootMidi.value - 1, props.task.platform as 'vocalize' | 'melisma', settingsStore.vocalRange);
});

const changeRootMidi = (offset: number) => {
  const newMidi = rootMidi.value + offset;
  if (isExerciseInBounds(newMidi, props.task.platform as 'vocalize' | 'melisma', settingsStore.vocalRange)) {
    rootMidi.value = newMidi;
  }
};

const isPlaying = ref(false);
const currentNoteIndex = ref<number | null>(null);
let playTimeout: ReturnType<typeof setTimeout> | null = null;

const stopPlayback = () => {
  isPlaying.value = false;
  currentNoteIndex.value = null;
  audioSynthesizer.stopAll();
  if (playTimeout) {
    clearTimeout(playTimeout);
    playTimeout = null;
  }
};

const playNextNote = async () => {
  if (!isPlaying.value || currentNoteIndex.value === null) return;
  
  const notes = exerciseNotes.value;
  if (currentNoteIndex.value >= notes.length) {
    stopPlayback();
    return;
  }

  const note = notes[currentNoteIndex.value];
  if (!note) {
    stopPlayback();
    return;
  }
  
  // Toca a nota no sintetizador (ou faz silêncio se for uma pausa)
  if (!note.isRest) {
    await audioSynthesizer.playNote(note.frequency, note.duration);
  } else {
    // Pausa: aguarda a duração correspondente
    await new Promise((resolve) => setTimeout(resolve, note.duration * 1000));
  }
  
  if (isPlaying.value && currentNoteIndex.value !== null) {
    currentNoteIndex.value++;
    playTimeout = setTimeout(() => {
      void playNextNote();
    }, 50);
  }
};

const togglePlay = async () => {
  if (isPlaying.value) {
    stopPlayback();
    return;
  }

  isPlaying.value = true;
  currentNoteIndex.value = 0;
  await playNextNote();
};

const beforeChecklistToggle = (newValue: boolean): Promise<boolean> | boolean => {
  if (!newValue) return true;
  if (workoutStore.isWorkoutActive) return true;

  return new Promise<boolean>((resolve) => {
    $q.dialog({
      title: 'Iniciar Treino? 🚀',
      message:
        'Você ainda não iniciou o treino de hoje. Deseja iniciar o treino agora para começar a marcar os exercícios?',
      cancel: { label: 'Cancelar', color: 'grey-7', flat: true },
      ok: { label: 'Iniciar Treino', color: 'primary', unelevated: true },
      persistent: true,
    })
      .onOk(() => {
        routineStore.resetAllChecklists();
        workoutStore.startTimer();
        $q.notify({
          type: 'positive',
          message: '🚀 Treino iniciado!',
        });
        resolve(true);
      })
      .onCancel(() => {
        resolve(false);
      });
  });
};

// --- REFERÊNCIAS DOS BOTÕES ---
const copyBtnRef = ref<any | null>(null);
const editBtnRef = ref<any | null>(null);
const deleteBtnRef = ref<any | null>(null);

// --- FUNÇÃO DE ANIMAÇÃO GENÉRICA (Glitter + Shake) ---
const animateAction = (btnRef: any, glitterColor: string, onCompleteCallback: () => void) => {
  if (!btnRef || !btnRef.$el) {
    onCompleteCallback();
    return;
  }

  const btnElement = btnRef.$el;
  const tl = gsap.timeline({ onComplete: onCompleteCallback });

  // 1. Chacoalho (Shake) rápido do botão
  tl.fromTo(
    btnElement,
    { rotation: -15 },
    { rotation: 15, duration: 0.05, yoyo: true, repeat: 3, ease: 'power1.inOut' },
  ).to(btnElement, { rotation: 0, duration: 0.05 });

  // 2. Geração dos Glitters
  const rect = btnElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 8; i++) {
    const glitter = document.createElement('div');
    glitter.classList.add('action-glitter');
    glitter.style.backgroundColor = glitterColor;

    glitter.style.left = `${centerX}px`;
    glitter.style.top = `${centerY}px`;
    document.body.appendChild(glitter);

    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 40;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance;

    gsap.to(glitter, {
      x: destX,
      y: destY,
      scale: Math.random() * 1.5 + 0.5,
      opacity: 0,
      rotation: Math.random() * 360,
      duration: 0.6 + Math.random() * 0.4,
      ease: 'power2.out',
      onComplete: () => {
        glitter.remove();
      },
    });
  }
};

// --- HANDLERS DOS BOTÕES ---

const handleDuplicate = () => {
  animateAction(copyBtnRef.value, '#00E5FF', () => {
    emit('duplicate', props.task);
  });
};

const handleEdit = () => {
  animateAction(editBtnRef.value, '#FFD700', () => {
    emit('edit', props.task);
  });
};

const handleDelete = () => {
  animateAction(deleteBtnRef.value, '#FF1744', () => {
    emit('delete', props.task);
  });
};

// --- HELPERS DE PLATAFORMA ---
const getPlatformIcon = (platform: PlatformType) => {
  if (platform === 'udemy') return 'school';
  if (platform === 'hotmart') return 'local_fire_department';
  if (platform === 'yousician') return 'piano';
  if (platform === 'vocalize') return 'graphic_eq';
  if (platform === 'melisma') return 'waves';
  return 'link';
};

const getPlatformColor = (platform: PlatformType) => {
  if (platform === 'udemy') return 'deep-purple-6';
  if (platform === 'hotmart') return 'deep-orange-8';
  if (platform === 'yousician') return 'green-6';
  if (platform === 'vocalize') return 'secondary';
  if (platform === 'melisma') return 'secondary';
  return 'primary';
};

const getPlatformName = (platform: PlatformType) => {
  if (platform === 'udemy') return 'Udemy';
  if (platform === 'hotmart') return 'Hotmart';
  if (platform === 'yousician') return 'Yousician App';
  if (platform === 'vocalize') return 'Exercício de Vocalize';
  if (platform === 'melisma') return 'Exercício de Melisma';
  return 'Plataforma Externa';
};

// --- FORMATADOR DE URL DO YOUTUBE ---
const getEmbedUrl = (url?: string) => {
  if (!url) return '';

  // Se já for um link de embed, retorna direto
  if (url.includes('/embed/')) return url;

  // Se for link copiado pelo celular (youtu.be/ID)
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Se for link padrão do navegador (youtube.com/watch?v=ID)
  if (url.includes('watch?v=')) {
    const videoId = url.split('watch?v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
};

// --- FORMATAÇÃO DE DATA ---
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
</script>

<style scoped>
.pulse-active {
  animation: pulseScale 0.4s infinite alternate;
}
@keyframes pulseScale {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}
.dark-player {
  background-color: #121212 !important;
}

.routine-card {
  border-radius: 16px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.routine-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}


.action-btn:hover {
  opacity: 0.9;
}

/* Cursores para a área de arrastar */
.drag-handle {
  cursor: grab;
}
.drag-handle:active {
  cursor: grabbing;
}
</style>

<style>
.action-glitter {
  position: fixed;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
}

.pointer-events-none {
  pointer-events: none;
  opacity: 0.8;
}
</style>
