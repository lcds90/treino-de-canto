<template>
  <q-page class="q-pa-md flex flex-center">
    <div class="metronome-wrapper" ref="containerRef">
      <!-- Single Unified Container -->
      <q-card class="metronome-card shadow-6 q-pa-lg animated-card">
        <!-- Vue Transition for smooth view switching -->
        <transition name="fade-switch" mode="out-in">
          <!-- STATE 1: CONFIGURATION MODE -->
          <div v-if="viewMode === 'config'" key="config" class="q-gutter-y-md">
            <div class="text-center">
              <h1 class="text-h4 text-weight-bolder text-primary q-my-xs flex flex-center">
                <q-icon name="av_timer" class="q-mr-sm" />
                Metrônomo
              </h1>
              <p class="text-subtitle2 text-grey-6">
                Configure seu tempo de treino vocal e o ritmo ideal.
              </p>
            </div>

            <!-- Time Settings -->
            <div class="q-mt-lg">
              <div class="text-subtitle2 text-weight-bold text-grey-7 q-mb-sm flex items-center">
                <q-icon name="timer" class="q-mr-xs" /> Tempo de Prática
              </div>
              <q-btn-toggle
                v-model="presetMinutes"
                spread
                no-caps
                rounded
                unelevated
                toggle-color="primary"
                toggle-text-color="white"
                color="grey-2"
                text-color="grey-8"
                :options="[
                  { label: '1 min', value: 1 },
                  { label: '5 min', value: 5 },
                  { label: '10 min', value: 10 },
                  { label: 'Personalizar', value: 'custom' },
                ]"
              />

              <!-- Custom Time Inputs -->
              <transition name="fade-slide">
                <div
                  v-if="presetMinutes === 'custom'"
                  class="row q-col-gutter-md justify-center items-center q-mt-xs"
                >
                  <div class="col-5">
                    <q-input
                      v-model.number="customMinutes"
                      type="number"
                      label="Minutos"
                      outlined
                      dense
                      min="0"
                      max="180"
                    />
                  </div>
                  <div class="col-2 text-center text-weight-bold text-h6 text-grey-6">:</div>
                  <div class="col-5">
                    <q-input
                      v-model.number="customSeconds"
                      type="number"
                      label="Segundos"
                      outlined
                      dense
                      min="0"
                      max="59"
                    />
                  </div>
                </div>
              </transition>
            </div>

            <!-- BPM Settings -->
            <div class="q-mt-lg">
              <div class="row justify-between items-center q-mb-xs">
                <span class="text-subtitle2 text-weight-bold text-grey-7 flex items-center">
                  <q-icon name="music_note" class="q-mr-xs" /> Ritmo (BPM)
                </span>
                <span class="text-h6 text-weight-bolder text-secondary font-monospace">
                  {{ bpm }} <span class="text-caption text-grey-6 text-weight-medium">BPM</span>
                </span>
              </div>
              <q-slider
                v-model="bpm"
                :min="40"
                :max="240"
                :step="1"
                color="secondary"
                class="q-mt-sm"
              />
              <div class="row justify-center q-gutter-sm q-mt-sm">
                <q-btn
                  outline
                  dense
                  color="primary"
                  label="-5"
                  class="bpm-adj-btn font-monospace"
                  @click="adjustBpm(-5)"
                />
                <q-btn
                  outline
                  dense
                  color="primary"
                  label="-1"
                  class="bpm-adj-btn font-monospace"
                  @click="adjustBpm(-1)"
                />
                <q-btn
                  outline
                  dense
                  color="primary"
                  label="+1"
                  class="bpm-adj-btn font-monospace"
                  @click="adjustBpm(1)"
                />
                <q-btn
                  outline
                  dense
                  color="primary"
                  label="+5"
                  class="bpm-adj-btn font-monospace"
                  @click="adjustBpm(5)"
                />
              </div>
            </div>

            <!-- Play / Start Button -->
            <div class="text-center q-mt-xl">
              <q-btn
                color="primary"
                text-color="white"
                size="lg"
                rounded
                unelevated
                icon="play_arrow"
                label="Iniciar Treino"
                class="full-width play-start-btn shadow-2"
                @click="handlePlay"
              />
            </div>
          </div>

          <!-- STATE 2: ACTIVE PLAYING MODE -->
          <div v-else key="active" class="q-gutter-y-sm text-center">
            <div class="text-center">
              <h2 class="text-h5 text-weight-bolder text-primary q-my-xs">
                Sessão em Andamento
              </h2>
              <div class="text-caption text-grey-6">
                Andamento: <span class="text-weight-bold text-secondary font-monospace">{{ bpm }} BPM</span>
              </div>
            </div>

            <!-- Big Circular Countdown -->
            <div class="flex flex-center q-my-sm">
              <q-circular-progress
                show-value
                class="timer-progress"
                :value="progressPercent"
                size="150px"
                :thickness="0.08"
                color="primary"
                track-color="grey-2"
              >
                <div class="text-center">
                  <div class="text-h4 text-weight-bold font-monospace">{{ formattedTime }}</div>
                  <div class="text-caption text-grey-6 text-uppercase text-weight-bold text-mini">
                    {{ timerStateLabel }}
                  </div>
                </div>
              </q-circular-progress>
            </div>

            <!-- Traditional Mechanical Metronome SVG Visualizer -->
            <div class="pendulum-outer-container relative-position q-py-sm">
              <div class="pendulum-container flex justify-center items-center">
                <svg width="200" height="150" viewBox="0 0 200 150" class="mechanical-metronome-svg">
                  <!-- Outer Body Shadow -->
                  <path
                    d="M 60,10 L 140,10 L 175,135 L 25,135 Z"
                    fill="rgba(0, 0, 0, 0.12)"
                    class="body-shadow"
                  />

                  <!-- Main Wooden Casing (Trapezoid) -->
                  <path
                    d="M 62,12 L 138,12 L 170,130 L 30,130 Z"
                    fill="url(#woodGradient)"
                    stroke="#2a120c"
                    stroke-width="2"
                  />

                  <!-- Front Plate / Inlay scale -->
                  <path
                    d="M 75,20 L 125,20 L 145,120 L 55,120 Z"
                    fill="url(#plateGradient)"
                    stroke="#bcaaa4"
                    stroke-width="1"
                  />

                  <!-- Glow Plate overlay for visual flashes -->
                  <path
                    ref="glowPlateRef"
                    d="M 75,20 L 125,20 L 145,120 L 55,120 Z"
                    fill="var(--q-primary)"
                    style="opacity: 0; mix-blend-mode: color-dodge;"
                  />

                  <!-- Scale markings / ticks -->
                  <line x1="88" y1="35" x2="94" y2="35" stroke="#8d6e63" stroke-width="1.5" />
                  <line x1="86" y1="55" x2="94" y2="55" stroke="#8d6e63" stroke-width="1.5" />
                  <line x1="84" y1="75" x2="94" y2="75" stroke="#8d6e63" stroke-width="1.5" />
                  <line x1="82" y1="95" x2="94" y2="95" stroke="#8d6e63" stroke-width="1.5" />

                  <line x1="106" y1="35" x2="112" y2="35" stroke="#8d6e63" stroke-width="1.5" />
                  <line x1="106" y1="55" x2="114" y2="55" stroke="#8d6e63" stroke-width="1.5" />
                  <line x1="106" y1="75" x2="116" y2="75" stroke="#8d6e63" stroke-width="1.5" />
                  <line x1="106" y1="95" x2="118" y2="95" stroke="#8d6e63" stroke-width="1.5" />

                  <!-- Swinging Arm Group -->
                  <g ref="swingingArmRef" transform-origin="100 115">
                    <!-- Center Slot for Pendulum swing (moved inside group) -->
                    <rect x="97" y="22" width="6" height="90" rx="2" fill="#200d08" />

                    <!-- Metal Rod -->
                    <line
                      x1="100"
                      y1="115"
                      x2="100"
                      y2="25"
                      stroke="url(#metalGradient)"
                      stroke-width="3.5"
                      stroke-linecap="round"
                    />

                    <!-- Adjustable Sliding Weight -->
                    <path
                      :d="`M ${100 - 9} ${weightY} L ${100 + 9} ${weightY} L ${100 + 6} ${weightY + 12} L ${100 - 6} ${weightY + 12} Z`"
                      fill="url(#goldGradient)"
                      stroke="#bf360c"
                      stroke-width="0.5"
                      class="metronome-weight"
                    />
                    <line
                      :x1="100 - 8"
                      :y1="weightY + 6"
                      :x2="100 + 8"
                      :y2="weightY + 6"
                      stroke="#d84315"
                      stroke-width="1"
                    />
                  </g>

                  <!-- Brass Pivot Cap (Base of pendulum) -->
                  <circle cx="100" cy="115" r="7" fill="url(#metalGradient)" stroke="#424242" stroke-width="1" />
                  <circle cx="100" cy="115" r="3" fill="#212121" />

                  <!-- Bottom base plate -->
                  <rect x="25" y="130" width="150" height="8" rx="2" fill="#3e2723" />

                  <!-- SVG Definitions for Gradients -->
                  <defs>
                    <!-- Wood casing gradient -->
                    <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color: #3e2723" />
                      <stop offset="50%" style="stop-color: #5d4037" />
                      <stop offset="100%" style="stop-color: #3e2723" />
                    </linearGradient>

                    <!-- Front plate panel (lighter wood/gold) -->
                    <linearGradient id="plateGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color: #d7ccc8" />
                      <stop offset="50%" style="stop-color: #efebe9" />
                      <stop offset="100%" style="stop-color: #d7ccc8" />
                    </linearGradient>

                    <!-- Metal rod gradient -->
                    <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color: #757575" />
                      <stop offset="50%" style="stop-color: #e0e0e0" />
                      <stop offset="100%" style="stop-color: #757575" />
                    </linearGradient>

                    <!-- Shiny gold weight gradient -->
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color: #f57f17" />
                      <stop offset="50%" style="stop-color: #fff59d" />
                      <stop offset="100%" style="stop-color: #f57f17" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <!-- Beat dots indicators -->
              <div class="row justify-center q-gutter-md q-mt-sm">
                <div
                  v-for="b in [0, 1, 2, 3]"
                  :key="b"
                  class="beat-indicator-dot"
                  :class="{
                    active: currentBeat === b,
                    accent: b === 0,
                  }"
                ></div>
              </div>
            </div>

            <!-- Control Buttons Row -->
            <div class="row justify-around items-center q-mt-lg q-pt-sm border-top">
              <!-- Mute / Unmute -->
              <q-btn
                flat
                round
                size="lg"
                :color="isMuted ? 'grey-6' : 'secondary'"
                :icon="isMuted ? 'volume_off' : 'volume_up'"
                @click="isMuted = !isMuted"
              >
                <q-tooltip>{{ isMuted ? 'Ativar Som' : 'Mudar para Mudo' }}</q-tooltip>
              </q-btn>

              <!-- Play / Pause -->
              <q-btn
                v-if="timerState === 'running'"
                round
                size="xl"
                color="warning"
                icon="pause"
                class="shadow-2 action-btn"
                @click="handlePause"
              >
                <q-tooltip>Pausar Treino</q-tooltip>
              </q-btn>
              <q-btn
                v-else
                round
                size="xl"
                color="secondary"
                icon="play_arrow"
                class="shadow-2 action-btn"
                @click="handleContinue"
              >
                <q-tooltip>Continuar Treino</q-tooltip>
              </q-btn>

              <!-- Stop (Returns to Configuration Mode) -->
              <q-btn
                round
                size="lg"
                color="negative"
                icon="stop"
                @click="handleStop"
              >
                <q-tooltip>Parar e Configurar</q-tooltip>
              </q-btn>
            </div>
          </div>
        </transition>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import gsap from 'gsap';

const $q = useQuasar();

// --- STATE MANAGEMENT ---
const viewMode = ref<'config' | 'active'>('config');
const timerState = ref<'stopped' | 'running' | 'paused'>('stopped');
const presetMinutes = ref<number | 'custom'>(5);
const customMinutes = ref(1);
const customSeconds = ref(0);
const timerRemaining = ref(300); // 5 min in seconds
const totalDuration = ref(300);

// --- METRONOME ---
const bpm = ref(120);
const isPlaying = ref(false);
const isMuted = ref(false);
const currentBeat = ref(-1); // 0 to 3 index

// Web Audio API Context and state
let audioContext: AudioContext | null = null;
let nextNoteTime = 0.0;
let beatCount = 0;
const lookahead = 25.0; // call scheduler every 25ms
const scheduleAheadTime = 0.1; // schedule 100ms in advance
let metronomeIntervalId: ReturnType<typeof setInterval> | null = null;
let countdownIntervalId: ReturnType<typeof setInterval> | null = null;

// References to DOM elements for GSAP
const containerRef = ref<HTMLElement | null>(null);
const swingingArmRef = ref<SVGElement | null>(null);
const glowPlateRef = ref<SVGElement | null>(null);

// Computed labels & states
const timerStateLabel = computed(() => {
  if (timerState.value === 'running') return 'Treinando';
  if (timerState.value === 'paused') return 'Pausado';
  return 'Pronto';
});

const formattedTime = computed(() => {
  const mins = Math.floor(timerRemaining.value / 60);
  const secs = timerRemaining.value % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
});

const progressPercent = computed(() => {
  if (totalDuration.value <= 0) return 0;
  return (timerRemaining.value / totalDuration.value) * 100;
});

// Calculate weight Y-position based on BPM (Linear interpolation)
const weightY = computed(() => {
  // 40 BPM -> weightY = 35 (high, slow)
  // 240 BPM -> weightY = 95 (low, fast)
  const bpmMin = 40;
  const bpmMax = 240;
  const yMin = 35;
  const yMax = 95;

  const percentage = (bpm.value - bpmMin) / (bpmMax - bpmMin);
  return yMin + percentage * (yMax - yMin);
});

// Watch settings and adapt duration
const resetTimerDuration = () => {
  if (presetMinutes.value === 'custom') {
    const mins = Math.max(0, parseInt(String(customMinutes.value)) || 0);
    const secs = Math.max(0, Math.min(59, parseInt(String(customSeconds.value)) || 0));
    timerRemaining.value = mins * 60 + secs;
  } else {
    timerRemaining.value = presetMinutes.value * 60;
  }
  totalDuration.value = timerRemaining.value;
};

watch([presetMinutes, customMinutes, customSeconds], () => {
  if (timerState.value !== 'running') {
    resetTimerDuration();
    timerState.value = 'stopped';
  }
});

// Initialize AudioContext lazily on user gesture
const initAudio = () => {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      console.warn('Web Audio API is not supported in this browser');
      return;
    }
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === 'suspended') {
    void audioContext.resume();
  }
};

// GSAP Programmatic Animation Trigger
const animateBeatVisuals = (beatNumber: number) => {
  const duration = 60.0 / bpm.value; // duration of one beat in seconds
  const isAccent = beatNumber === 0;

  // 1. Swing the pendulum arm using sine.inOut for smooth harmonic swing physics
  if (swingingArmRef.value) {
    gsap.to(swingingArmRef.value, {
      rotation: beatNumber % 2 === 0 ? -28 : 28,
      duration: duration * 0.98,
      ease: 'sine.inOut', // Smooth physical pendulum easing
      svgOrigin: '100 115', // Explicit pivot point in SVG coordinates to avoid browser bugs
      overwrite: 'auto',
    });
  }

  // 2. Pulse Faceplate Glow
  if (glowPlateRef.value) {
    gsap.fromTo(
      glowPlateRef.value,
      { opacity: isAccent ? 0.45 : 0.2 },
      {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out',
      },
    );
  }
};

// Scheduler look-ahead loop
const scheduler = () => {
  if (!audioContext) return;

  // Se o tempo da próxima nota estiver muito no passado (ex: aba em background ou lag),
  // reseta para o tempo atual do AudioContext para evitar loop infinito de catching up.
  if (nextNoteTime < audioContext.currentTime) {
    nextNoteTime = audioContext.currentTime;
  }

  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
    scheduleNote(beatCount, nextNoteTime);
    nextNote();
  }
};

const nextNote = () => {
  const secondsPerBeat = 60.0 / bpm.value;
  nextNoteTime += secondsPerBeat;
  beatCount = (beatCount + 1) % 4;
};

const scheduleNote = (beatNumber: number, time: number) => {
  if (!audioContext) return;

  // Visual beat trigger synchronized with AudioContext time
  const delayMs = Math.max(0, (time - audioContext.currentTime) * 1000);
  setTimeout(() => {
    if (isPlaying.value) {
      currentBeat.value = beatNumber;
      animateBeatVisuals(beatNumber);
    }
  }, delayMs);

  if (isMuted.value) return;

  const osc = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  osc.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Beep pitch: beat 0 is accented (880Hz), rest are 440Hz
  osc.frequency.value = beatNumber === 0 ? 880 : 440;

  gainNode.gain.setValueAtTime(0.15, time);
  gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.08); // decay click sound

  osc.start(time);
  osc.stop(time + 0.1);
};

// Metronome operations
const startMetronome = () => {
  initAudio();
  if (!audioContext) {
    $q.notify({
      type: 'negative',
      message: 'Web Audio API não é suportada neste navegador.',
    });
    return;
  }
  if (isPlaying.value) return;

  isPlaying.value = true;

  // Set nextNoteTime 150ms in the future to allow the pendulum to swing to its starting position (28 degrees)
  nextNoteTime = audioContext.currentTime + 0.15;
  beatCount = 0;
  currentBeat.value = -1;

  if (swingingArmRef.value) {
    if (viewMode.value === 'config') {
      // Snapping is fine because config view is fading out
      gsap.set(swingingArmRef.value, {
        rotation: 28,
        svgOrigin: '100 115'
      });
    } else {
      // Smoothly swing from current position (0) to starting position (28)
      gsap.to(swingingArmRef.value, {
        rotation: 28,
        duration: 0.15,
        ease: 'power1.out',
        svgOrigin: '100 115',
        overwrite: 'auto'
      });
    }
  }

  if (metronomeIntervalId) clearInterval(metronomeIntervalId);
  metronomeIntervalId = setInterval(scheduler, lookahead);
};

const stopMetronome = () => {
  isPlaying.value = false;
  currentBeat.value = -1;
  if (metronomeIntervalId) {
    clearInterval(metronomeIntervalId);
    metronomeIntervalId = null;
  }

  // Smooth GSAP reset of visual components
  if (swingingArmRef.value) {
    gsap.to(swingingArmRef.value, {
      rotation: 0,
      duration: 0.3,
      ease: 'power2.out',
      svgOrigin: '100 115',
      overwrite: 'auto'
    });
  }
  if (glowPlateRef.value) {
    gsap.to(glowPlateRef.value, { opacity: 0, duration: 0.3 });
  }
};

// Countdown Timer operations
const startCountdown = () => {
  if (countdownIntervalId) clearInterval(countdownIntervalId);
  countdownIntervalId = setInterval(() => {
    if (timerRemaining.value > 1) {
      timerRemaining.value--;
    } else {
      timerRemaining.value = 0;
      finishTimer();
    }
  }, 1000);
};

const pauseCountdown = () => {
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
  }
};

const stopCountdown = () => {
  pauseCountdown();
  resetTimerDuration();
};

const finishTimer = () => {
  stopMetronome();
  stopCountdown();
  timerState.value = 'stopped';
  viewMode.value = 'config'; // Return to configuration mode upon completion

  // Play C Major arpejo beep melody
  playEndMelody();

  $q.notify({
    type: 'positive',
    icon: 'emoji_events',
    message: 'Excelente! Seu tempo de treino vocal foi concluído!',
    position: 'top',
    timeout: 6000,
    actions: [{ label: 'OK', color: 'white' }],
  });
};

const playEndMelody = () => {
  initAudio();
  if (!audioContext || isMuted.value) return;

  const now = audioContext.currentTime;
  const playBeep = (time: number, freq: number, duration: number) => {
    const osc = audioContext!.createOscillator();
    const gainNode = audioContext!.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioContext!.destination);

    osc.frequency.value = freq;
    gainNode.gain.setValueAtTime(0.15, time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.02);

    osc.start(time);
    osc.stop(time + duration);
  };

  playBeep(now, 523.25, 0.15); // C5
  playBeep(now + 0.15, 659.25, 0.15); // E5
  playBeep(now + 0.3, 783.99, 0.15); // G5
  playBeep(now + 0.45, 1046.5, 0.4); // C6
};

// Actions Handlers
const handlePlay = () => {
  initAudio();
  if (timerRemaining.value <= 0) {
    $q.notify({
      type: 'warning',
      message: 'Defina um tempo de prática antes de iniciar.',
    });
    return;
  }

  viewMode.value = 'active'; // Switch to execution layout
  timerState.value = 'running';
  startCountdown();
  startMetronome();
};

const handlePause = () => {
  timerState.value = 'paused';
  pauseCountdown();
  stopMetronome();
};

const handleContinue = () => {
  initAudio();
  timerState.value = 'running';
  startCountdown();
  startMetronome();
};

const handleStop = () => {
  timerState.value = 'stopped';
  stopCountdown();
  stopMetronome();
  viewMode.value = 'config'; // Switch back to configurations
};

const adjustBpm = (delta: number) => {
  bpm.value = Math.max(40, Math.min(240, bpm.value + delta));
};

// Entrance Animation
onMounted(() => {
  resetTimerDuration();

  if (containerRef.value) {
    gsap.from(containerRef.value.querySelectorAll('.animated-card'), {
      y: 40,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    });
  }
});

onUnmounted(() => {
  stopMetronome();
  stopCountdown();
  if (audioContext) {
    void audioContext.close();
  }
});
</script>

<style scoped>
.metronome-wrapper {
  max-width: 480px;
  width: 100%;
}

.metronome-card {
  border-radius: 20px;
  min-height: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: min-height 0.3s ease;
}

.font-monospace {
  font-family: 'Courier New', Courier, monospace;
}

.timer-progress {
  transition: transform 0.3s ease;
}
.timer-progress:hover {
  transform: scale(1.02);
}

.play-start-btn {
  height: 52px;
  font-weight: bold;
}

.bpm-adj-btn {
  min-width: 50px;
  font-weight: bold;
}

.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}
body.body--dark .border-top {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

/* Transitions classes for Card States switching */
.fade-switch-enter-active,
.fade-switch-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}
.fade-switch-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fade-switch-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* Transitions classes for custom toggle input */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Mechanical visualizer outer container */
.pendulum-outer-container {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 1px dashed rgba(0, 0, 0, 0.05);
}
body.body--dark .pendulum-outer-container {
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.05);
}

.pendulum-container {
  height: 145px;
  position: relative;
}

.mechanical-metronome-svg {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.08));
  overflow: visible;
}

/* Beat indicators styling */
.beat-indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ccc;
  opacity: 0.3;
  transition: all 0.08s ease;
}
body.body--dark .beat-indicator-dot {
  background: #444;
}

.beat-indicator-dot.active {
  opacity: 1;
  transform: scale(1.2);
  background: var(--q-secondary);
  box-shadow: 0 0 8px var(--q-secondary);
}
.beat-indicator-dot.active.accent {
  background: var(--q-accent);
  box-shadow: 0 0 8px var(--q-accent);
}

.text-mini {
  font-size: 0.65rem;
}
</style>
