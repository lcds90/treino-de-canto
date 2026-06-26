<template>
  <q-card
    class="reference-keyboard-card shadow-8 border-radius-16"
    :class="{ 'dark-mode': $q.dark.isActive, 'large-keyboard': large }"
  >
    <q-card-section class="q-py-sm bg-primary text-white row items-center justify-between">
      <div class="row items-center">
        <q-icon name="piano" size="sm" class="q-mr-sm" />
        <div class="text-subtitle1 text-weight-bold" :class="{ 'text-h6': large }">
          Teclado de Referência
        </div>
      </div>
      <q-btn v-if="!hideClose" icon="close" flat round dense v-close-popup size="sm" />
    </q-card-section>

    <q-card-section class="q-pa-md">
      <!-- Painel de Controles: Oitavas e Alcance -->
      <div class="row items-center justify-between q-col-gutter-sm q-mb-md">
        <!-- Controles de Oitava -->
        <div class="row items-center q-gutter-x-sm">
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="remove"
            @click="shiftOctave(-1)"
            :disabled="baseOctave <= 1"
          >
            <q-tooltip>Descer uma oitava</q-tooltip>
          </q-btn>
          <div class="text-weight-bold text-subtitle2 text-grey-8" :class="{ 'text-grey-3': $q.dark.isActive }">
            Oitavas: C{{ baseOctave }} - B{{ baseOctave + 1 }}
          </div>
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="add"
            @click="shiftOctave(1)"
            :disabled="baseOctave >= 6"
          >
            <q-tooltip>Subir uma oitava</q-tooltip>
          </q-btn>
        </div>

        <!-- Informações do Alcance Vocal do Usuário -->
        <div class="row items-center q-gutter-xs">
          <q-chip color="secondary" text-color="white" icon="mic" class="text-weight-bold">
            Alcance: {{ vocalRangeInfo.name }} ({{ vocalRangeLimits }})
          </q-chip>
        </div>
      </div>

      <!-- Teclado Visual -->
      <div class="piano-container row justify-center">
        <div class="piano" :class="{ 'large-piano': large }">
          <!-- Teclar Brancas (14 para 2 oitavas) -->
          <div
            v-for="(key, idx) in whiteKeys"
            :key="key.midi"
            class="piano-key white-key"
            :class="{
              'large-white-key': large,
              'in-range': isKeyInRange(key.midi),
              'active-midi': activeMidiNotes.has(key.midi)
            }"
            @mousedown="play(key.frequency)"
          >
            <div class="key-label column items-center" :class="{ 'large-key-label': large }">
              <div>
                {{ key.name.split(' ')[0] }}<sub class="octave-sub">{{ key.name.split(' ')[1] }}</sub>
              </div>
              <span v-if="large" class="shortcut-hint">
                {{ getShortcutForWhiteKey(idx) }}
              </span>
            </div>
          </div>

          <!-- Teclas Pretas (10 para 2 oitavas) -->
          <div
            v-for="(key, idx) in blackKeys"
            :key="key.midi"
            class="piano-key black-key"
            :class="{
              'large-black-key': large,
              'in-range': isKeyInRange(key.midi),
              'active-midi': activeMidiNotes.has(key.midi)
            }"
            :style="{ left: `calc(100% / 14 * ${key.whiteIndex})` }"
            @mousedown="play(key.frequency)"
          >
            <div class="key-label-black column items-center" :class="{ 'large-key-label-black': large }">
              <div>
                {{ key.name.split(' ')[0] }}<sub class="octave-sub">{{ key.name.split(' ')[1] }}</sub>
              </div>
              <span v-if="large" class="shortcut-hint-black">
                {{ getShortcutForBlackKey(idx) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { useSettingsStore } from 'src/stores/settings-store';
import { audioSynthesizer } from 'src/services/audio-synthesizer';
import { VOCAL_RANGES, getFrequencyFromMidi, getNoteNameFromMidi } from 'src/services';

const props = defineProps<{
  hideClose?: boolean;
  large?: boolean;
}>();

const $q = useQuasar();
const settingsStore = useSettingsStore();

const activeMidiNotes = ref<Set<number>>(new Set());
let midiAccess: any = null;

// Atalhos do teclado QWERTY (Z-X-C... e Q-W-E...)
const KEY_MAP: Record<string, { type: 'white' | 'black'; index: number }> = {
  z: { type: 'white', index: 0 },
  x: { type: 'white', index: 1 },
  c: { type: 'white', index: 2 },
  v: { type: 'white', index: 3 },
  b: { type: 'white', index: 4 },
  n: { type: 'white', index: 5 },
  m: { type: 'white', index: 6 },
  s: { type: 'black', index: 0 },
  d: { type: 'black', index: 1 },
  g: { type: 'black', index: 2 },
  h: { type: 'black', index: 3 },
  j: { type: 'black', index: 4 },
  q: { type: 'white', index: 7 },
  w: { type: 'white', index: 8 },
  e: { type: 'white', index: 9 },
  r: { type: 'white', index: 10 },
  t: { type: 'white', index: 11 },
  y: { type: 'white', index: 12 },
  u: { type: 'white', index: 13 },
  '2': { type: 'black', index: 5 },
  '3': { type: 'black', index: 6 },
  '5': { type: 'black', index: 7 },
  '6': { type: 'black', index: 8 },
  '7': { type: 'black', index: 9 },
};

const pressedKeys = ref<Set<string>>(new Set());

const handleKeyDown = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement;
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
    return;
  }

  const key = event.key.toLowerCase();
  if (KEY_MAP[key] && !pressedKeys.value.has(key)) {
    pressedKeys.value.add(key);
    const mapping = KEY_MAP[key];
    const targetKey = mapping.type === 'white' 
      ? whiteKeys.value[mapping.index] 
      : blackKeys.value[mapping.index];

    if (targetKey) {
      activeMidiNotes.value.add(targetKey.midi);
      audioSynthesizer.startMidiNote(targetKey.midi, targetKey.frequency);
    }
  }
};

const handleKeyUp = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  if (pressedKeys.value.has(key)) {
    pressedKeys.value.delete(key);
    const mapping = KEY_MAP[key];
    const targetKey = mapping.type === 'white' 
      ? whiteKeys.value[mapping.index] 
      : blackKeys.value[mapping.index];

    if (targetKey) {
      activeMidiNotes.value.delete(targetKey.midi);
      audioSynthesizer.stopMidiNote(targetKey.midi);
    }
  }
};

const getShortcutForWhiteKey = (index: number): string => {
  const whiteShortcuts = ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U'];
  return whiteShortcuts[index] || '';
};

const getShortcutForBlackKey = (index: number): string => {
  const blackShortcuts = ['S', 'D', 'G', 'H', 'J', '2', '3', '5', '6', '7'];
  return blackShortcuts[index] || '';
};

const onMIDIMessage = (event: any) => {
  const [status, note, velocity] = event.data;
  const command = status & 0xf0;

  if (command === 0x90 && velocity > 0) {
    activeMidiNotes.value.add(note);
    audioSynthesizer.startMidiNote(note, getFrequencyFromMidi(note));
  } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
    activeMidiNotes.value.delete(note);
    audioSynthesizer.stopMidiNote(note);
  }
};

const setupMIDI = async () => {
  if (navigator.requestMIDIAccess) {
    try {
      midiAccess = await navigator.requestMIDIAccess();
      for (const input of midiAccess.inputs.values()) {
        input.onmidimessage = onMIDIMessage;
      }
      midiAccess.onstatechange = (e: any) => {
        if (e.port.type === 'input') {
          if (e.port.state === 'connected') {
            e.port.onmidimessage = onMIDIMessage;
          } else if (e.port.state === 'disconnected') {
            e.port.onmidimessage = null;
          }
        }
      };
    } catch (err) {
      console.warn('Acesso MIDI não suportado ou negado:', err);
    }
  }
};

onMounted(() => {
  void setupMIDI();
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
});

onUnmounted(() => {
  if (midiAccess) {
    for (const input of midiAccess.inputs.values()) {
      input.onmidimessage = null;
    }
    midiAccess.onstatechange = null;
  }
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  audioSynthesizer.stopAll();
});

const baseOctave = ref(3);

// Sincroniza a oitava base inicial com a classificação do usuário
watch(
  () => settingsStore.vocalRange,
  (newRange) => {
    const info = VOCAL_RANGES[newRange];
    if (info) {
      baseOctave.value = Math.floor(info.defaultStartMidi / 12) - 1;
    }
  },
  { immediate: true }
);

const vocalRangeInfo = computed(() => {
  return VOCAL_RANGES[settingsStore.vocalRange] || VOCAL_RANGES.tenor;
});

const vocalRangeLimits = computed(() => {
  const info = vocalRangeInfo.value;
  if (!info) return '';
  return `${getNoteNameFromMidi(info.minMidi)} a ${getNoteNameFromMidi(info.maxMidi)}`;
});

const isKeyInRange = (midi: number) => {
  const info = vocalRangeInfo.value;
  if (!info) return false;
  return midi >= info.minMidi && midi <= info.maxMidi;
};

const shiftOctave = (direction: number) => {
  const newVal = baseOctave.value + direction;
  if (newVal >= 1 && newVal <= 6) {
    baseOctave.value = newVal;
  }
};

const whiteKeys = computed(() => {
  const keys = [];
  const labels = ['Dó', 'Ré', 'Mi', 'Fá', 'Sol', 'Lá', 'Si'];
  const offsets = [0, 2, 4, 5, 7, 9, 11];

  // Oitava 1
  for (let i = 0; i < 7; i++) {
    const midi = (baseOctave.value + 1) * 12 + offsets[i];
    keys.push({
      midi,
      name: getNoteNameFromMidi(midi),
      frequency: getFrequencyFromMidi(midi),
    });
  }
  // Oitava 2
  for (let i = 0; i < 7; i++) {
    const midi = (baseOctave.value + 2) * 12 + offsets[i];
    keys.push({
      midi,
      name: getNoteNameFromMidi(midi),
      frequency: getFrequencyFromMidi(midi),
    });
  }
  return keys;
});

const blackKeys = computed(() => {
  const keys = [];
  const labels = ['Dó#', 'Ré#', 'Fá#', 'Sol#', 'Lá#'];
  const offsets = [1, 3, 6, 8, 10];
  const whiteIndexes = [1, 2, 4, 5, 6];

  // Oitava 1
  for (let i = 0; i < 5; i++) {
    const midi = (baseOctave.value + 1) * 12 + offsets[i];
    keys.push({
      midi,
      name: getNoteNameFromMidi(midi),
      frequency: getFrequencyFromMidi(midi),
      whiteIndex: whiteIndexes[i],
    });
  }
  // Oitava 2
  for (let i = 0; i < 5; i++) {
    const midi = (baseOctave.value + 2) * 12 + offsets[i];
    keys.push({
      midi,
      name: getNoteNameFromMidi(midi),
      frequency: getFrequencyFromMidi(midi),
      whiteIndex: whiteIndexes[i] + 7,
    });
  }
  return keys;
});

const play = (freq: number) => {
  audioSynthesizer.stopAll();
  void audioSynthesizer.playNote(freq, 1.2);
};
</script>

<style scoped>
.reference-keyboard-card {
  width: 550px;
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  transition: width 0.3s ease;
}

.reference-keyboard-card.large-keyboard {
  width: 100%;
}

.dark-mode.reference-keyboard-card {
  background-color: #1e1e1e;
}

.piano-container {
  padding: 10px 0;
  width: 100%;
}

.piano {
  position: relative;
  display: flex;
  width: 490px;
  height: 130px;
  user-select: none;
  transition: width 0.3s ease, height 0.3s ease;
}

.piano.large-piano {
  width: 100%;
  height: 350px;
}

.piano-key {
  cursor: pointer;
}

.white-key {
  width: calc(100% / 14);
  height: 100%;
  background-color: #fbfbfb;
  border: 1px solid #dcdcdc;
  border-radius: 0 0 6px 6px;
  z-index: 1;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
  box-shadow: inset 0 -3px 0 #ededed;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.white-key.large-white-key {
  padding-bottom: 24px;
  border-radius: 0 0 10px 10px;
}

.white-key:hover {
  background-color: #f3f3f3;
}

.white-key:active {
  background-color: #e6e6e6;
  box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.15);
}

/* Destaque das teclas brancas no alcance vocal */
.white-key.in-range {
  background-color: #e0f2f1; /* Soft teal */
  border-color: #4db6ac;
  box-shadow: inset 0 -3px 0 #b2dfdb;
}

.white-key.in-range:hover {
  background-color: #b2dfdb;
}

.white-key.in-range:active {
  background-color: #80cbc4;
}

.black-key {
  position: absolute;
  width: 12px;
  height: 75px;
  background: linear-gradient(180deg, #2c2c2c 0%, #050505 100%);
  border-radius: 0 0 3px 3px;
  z-index: 2;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6px;
  transform: translateX(-50%);
  transition: background 0.15s ease;
}

.black-key.large-black-key {
  width: 32px;
  height: 220px;
  padding-bottom: 18px;
  border-radius: 0 0 8px 8px;
}

.black-key:hover {
  background: linear-gradient(180deg, #3d3d3d 0%, #151515 100%);
}

.black-key:active {
  background: #000000;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
  height: 73px;
}

.black-key.large-black-key:active {
  height: 217px;
}

/* Destaque das teclas pretas no alcance vocal */
.black-key.in-range {
  background: linear-gradient(180deg, #004d40 0%, #00796b 100%);
  box-shadow: 0px 3px 4px rgba(0, 77, 64, 0.4);
}

.black-key.in-range:hover {
  background: linear-gradient(180deg, #00695c 0%, #00897b 100%);
}

.black-key.in-range:active {
  background: #004d40;
}

.key-label {
  font-size: 8px;
  font-weight: bold;
  color: #777777;
}

.key-label.large-key-label {
  font-size: 15px;
}

.key-label-black {
  font-size: 6px;
  font-weight: bold;
  color: #ffffff;
}

.key-label-black.large-key-label-black {
  font-size: 11px;
}

.octave-sub {
  font-size: 80%;
  bottom: 0;
  margin-left: 1px;
}

.border-radius-16 {
  border-radius: 16px;
}

/* Estilos de depressão física da tecla ao receber sinal MIDI */
.white-key.active-midi {
  background-color: #e6e6e6 !important;
  box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.15) !important;
}

.white-key.in-range.active-midi {
  background-color: #80cbc4 !important;
  box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.2) !important;
}

.black-key.active-midi {
  background: #000000 !important;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5) !important;
  height: 73px !important;
}

.black-key.large-black-key.active-midi {
  height: 217px !important;
}

.black-key.in-range.active-midi {
  background: #004d40 !important;
  height: 73px !important;
}

.black-key.large-black-key.in-range.active-midi {
  height: 217px !important;
}

.shortcut-hint {
  font-size: 10px;
  display: inline-block;
  text-transform: uppercase;
  margin-top: 6px;
  padding: 2px 6px;
  background-color: #f1f1f1;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-family: monospace;
  color: #555555;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  font-weight: bold;
}

/* Ajustes no modo escuro para teclas brancas */
.dark-mode .shortcut-hint {
  background-color: #2c2c2c;
  border-color: #444444;
  color: #bbbbbb;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}

.shortcut-hint-black {
  font-size: 8px;
  display: inline-block;
  text-transform: uppercase;
  margin-top: 4px;
  padding: 1px 4px;
  background-color: #333333;
  border: 1px solid #555555;
  border-radius: 3px;
  font-family: monospace;
  color: #eeeeee;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.4);
  font-weight: bold;
}

/* Ajustes no modo escuro para teclas pretas */
.dark-mode .shortcut-hint-black {
  background-color: #444444;
  border-color: #666666;
  color: #ffffff;
}
</style>
