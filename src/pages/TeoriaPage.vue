<template>
  <q-page class="flex justify-center bg-grey-1 text-grey-9 q-py-xl" :class="{ 'bg-grey-10 text-white': $q.dark.isActive }">
    <div class="row max-width-container q-col-gutter-lg q-px-md">
      
      <!-- Sidebar de Navegação -->
      <div class="col-12 col-md-3">
        <q-card class="sticky-sidebar border-radius-16 shadow-3 glass-card" :dark="$q.dark.isActive">
          <q-card-section>
            <div class="text-h6 text-weight-bold text-primary flex items-center q-mb-md">
              <q-icon name="menu_book" class="q-mr-xs" />
              Tópicos de Teoria
            </div>
            <q-separator class="q-mb-md" />
            <q-list class="text-subtitle2 text-weight-medium">
              <q-item
                v-for="sec in sections"
                :key="sec.id"
                clickable
                v-ripple
                :active="activeSection === sec.id"
                active-class="text-weight-bolder text-primary bg-primary-light"
                class="border-radius-8 q-mb-xs"
                @click="scrollToSection(sec.id)"
              >
                <q-item-section avatar style="min-width: auto; padding-right: 12px">
                  <q-icon :name="sec.icon" :color="activeSection === sec.id ? 'primary' : 'grey-7'" size="sm" />
                </q-item-section>
                <q-item-section>{{ sec.title }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Conteúdo Detalhado -->
      <div class="col-12 col-md-9 q-gutter-y-lg">
        
        <!-- INTRODUÇÃO -->
        <section id="introducao" class="scroll-target">
          <q-card class="border-radius-16 shadow-2 text-left" :dark="$q.dark.isActive">
            <div class="card-gradient-header q-pa-lg text-white">
              <div class="text-h4 text-weight-bold">O Silêncio na Música 𝄾</div>
              <div class="text-subtitle1 opacity-80">Por que a ausência de som é o alicerce do canto</div>
            </div>
            <q-card-section class="q-pa-lg text-body1 line-height-18">
              <p>
                Na música, <strong>o silêncio não é a ausência de arte, mas sim uma de suas partes mais cruciais</strong>. Um compasso sem pausas seria como um texto sem pontos, vírgulas ou parágrafos: uma massa ininterrupta de som, impossível de compreender ou saborear. As figuras de silêncio (chamadas tecnicamente de <strong>pausas</strong>) delimitam o ritmo, criam tensão dramática e definem a pulsação.
              </p>
              <div class="row q-col-gutter-md q-my-md">
                <div class="col-12 col-sm-6">
                  <q-card flat bordered class="bg-primary-light-alpha border-radius-12 q-pa-md">
                    <div class="text-subtitle1 text-weight-bold text-primary q-mb-xs">🌬️ Respiração Diafragmática</div>
                    <p class="text-caption text-grey-8" :class="{ 'text-grey-3': $q.dark.isActive }">
                      Para nós, cantores, a pausa é o momento sagrado da inspiração. É nesse breve intervalo que relaxamos o diafragma e realizamos a reposição de ar sem pressa, preparando as pregas vocais para a próxima frase musical.
                    </p>
                  </q-card>
                </div>
                <div class="col-12 col-sm-6">
                  <q-card flat bordered class="bg-secondary-light-alpha border-radius-12 q-pa-md">
                    <div class="text-subtitle1 text-weight-bold text-secondary q-mb-xs">⚡ Tensão e Expressão</div>
                    <p class="text-caption text-grey-8" :class="{ 'text-grey-3': $q.dark.isActive }">
                      Um corte de som súbito logo antes de um refrão marcante cria uma expectativa gigantesca no ouvinte. O silêncio serve para destacar a nota que vem a seguir, conferindo peso e emoção à interpretação.
                    </p>
                  </q-card>
                </div>
              </div>
              <p>
                Cada nota musical tem um equivalente gráfico exato que dita por quanto tempo devemos calar a voz. A seguir, vamos explorar essas figuras de silêncio e ouvir como elas funcionam na prática.
              </p>
            </q-card-section>
          </q-card>
        </section>

        <!-- FIGURAS DE SILÊNCIO -->
        <section
          v-for="item in restItems"
          :key="item.id"
          :id="item.id"
          class="scroll-target"
        >
          <q-card class="border-radius-16 shadow-2 text-left" :dark="$q.dark.isActive">
            <q-card-section class="q-pa-lg">
              <div class="row items-center justify-between no-wrap q-col-gutter-sm q-mb-md">
                <div class="row items-center no-wrap col-grow">
                  <div class="rest-symbol-display text-primary bg-primary-light border-radius-12 q-mr-md text-weight-bold">
                    {{ item.symbol }}
                  </div>
                  <div>
                    <h2 class="text-h5 text-weight-bold q-my-none text-primary">{{ item.title }}</h2>
                    <div class="text-caption text-grey-7">Duração Equivalente: {{ item.durationText }}</div>
                  </div>
                </div>
                <div class="col-auto">
                  <q-btn
                    round
                    color="primary"
                    :icon="playingId === item.id ? 'stop' : 'play_arrow'"
                    size="md"
                    class="shadow-2"
                    @click="playAudioExample(item)"
                  >
                    <q-tooltip>{{ playingId === item.id ? 'Parar Demonstração' : 'Ouvir Pausa no Ritmo' }}</q-tooltip>
                  </q-btn>
                </div>
              </div>

              <!-- Indicador de Pulso do Áudio Ativo -->
              <div v-if="playingId === item.id" class="row justify-center q-gutter-xs q-mb-md">
                <div
                  v-for="beatIdx in item.examplePattern.length"
                  :key="beatIdx"
                  class="beat-pulse-box text-weight-bold flex flex-center"
                  :class="{
                    'active-beat': currentBeat === (beatIdx - 1),
                    'rest-beat': item.examplePattern[beatIdx - 1]?.isRest,
                    'note-beat': !item.examplePattern[beatIdx - 1]?.isRest
                  }"
                >
                  <q-icon :name="item.examplePattern[beatIdx - 1]?.isRest ? 'volume_off' : 'music_note'" size="xs" />
                  <div class="text-caption">{{ beatIdx }}</div>
                </div>
              </div>

              <div class="text-body1 text-grey-8" :class="{ 'text-grey-3': $q.dark.isActive }">
                <p v-html="item.description"></p>
              </div>

              <q-separator class="q-my-md" />

              <div class="bg-grey-2 border-radius-12 q-pa-sm" :class="{ 'bg-grey-9': $q.dark.isActive }">
                <div class="text-caption text-weight-bold text-grey-7 q-mb-xs">Representação na Pauta:</div>
                <div class="flex flex-center">
                  <svg viewBox="0 0 300 80" style="max-width: 250px; height: 80px; color: currentColor;">
                    <!-- Linhas da partitura -->
                    <line x1="10" y1="20" x2="290" y2="20" stroke="currentColor" stroke-width="1" opacity="0.4" />
                    <line x1="10" y1="30" x2="290" y2="30" stroke="currentColor" stroke-width="1" opacity="0.4" />
                    <line x1="10" y1="40" x2="290" y2="40" stroke="currentColor" stroke-width="1" opacity="0.4" />
                    <line x1="10" y1="50" x2="290" y2="50" stroke="currentColor" stroke-width="1" opacity="0.4" />
                    <line x1="10" y1="60" x2="290" y2="60" stroke="currentColor" stroke-width="1" opacity="0.4" />

                    <!-- Clave de sol simplificada -->
                    <text x="12" y="58" font-size="34" font-family="serif" fill="currentColor" opacity="0.8">𝄞</text>

                    <!-- Desenho da Pausa Específica -->
                    <!-- Semibreve (retângulo sob a 4ª linha, y=30) -->
                    <rect v-if="item.id === 'semibreve'" x="135" y="30" width="12" height="6" fill="currentColor" />
                    <!-- Mínima (retângulo sobre a 3ª linha, y=40, desenhado de 34 a 40) -->
                    <rect v-if="item.id === 'minima'" x="135" y="34" width="12" height="6" fill="currentColor" />
                    <!-- Semínima -->
                    <text v-if="item.id === 'seminima'" x="135" y="50" font-size="28" font-family="serif" fill="currentColor">𝄽</text>
                    <!-- Colcheia -->
                    <text v-if="item.id === 'colcheia'" x="135" y="50" font-size="28" font-family="serif" fill="currentColor">𝄾</text>
                    <!-- Semicolcheia -->
                    <text v-if="item.id === 'semicolcheia'" x="135" y="50" font-size="28" font-family="serif" fill="currentColor">𝄿</text>

                    <line x1="10" y1="20" x2="10" y2="60" stroke="currentColor" stroke-width="1.5" />
                    <line x1="290" y1="20" x2="290" y2="60" stroke="currentColor" stroke-width="1.5" />
                  </svg>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </section>

        <!-- LABORATÓRIO DE RITMOS INTERATIVO -->
        <section id="interativo" class="scroll-target q-mb-xl">
          <q-card class="border-radius-16 shadow-4 overflow-hidden text-left" :dark="$q.dark.isActive">
            <div class="card-gradient-header bg-secondary q-pa-lg text-white">
              <div class="text-h4 text-weight-bold">🔬 Laboratório de Ritmos</div>
              <div class="text-subtitle1 opacity-80">Monte seu próprio compasso misturando Notas e Silêncios e ouça em tempo real!</div>
            </div>
            <q-card-section class="q-pa-lg">
              <p class="text-body1">
                Aqui você pode criar um ritmo customizado de 4 tempos. Escolha para cada tempo se deseja uma <strong>Nota (som)</strong> ou uma <strong>Pausa (silêncio)</strong> e então aperte o play para escutar o metrônomo marcando os tempos enquanto o piano executa sua composição!
              </p>

              <!-- Grid de Composição -->
              <div class="row justify-around q-col-gutter-md q-my-lg">
                <div v-for="tIdx in 4" :key="tIdx" class="col-6 col-sm-3 text-center">
                  <div class="text-subtitle2 text-weight-bold text-secondary q-mb-sm">Tempo {{ tIdx }}</div>
                  <q-card
                    flat
                    bordered
                    class="composer-block cursor-pointer flex flex-center column q-pa-md border-radius-12"
                    :class="{
                      'active-composer-note bg-primary-light-alpha border-primary': userRhythm[tIdx - 1] === 'note',
                      'active-composer-rest bg-secondary-light-alpha border-secondary': userRhythm[tIdx - 1] === 'rest',
                      'pulse-active': labPlaying && labBeat === (tIdx - 1)
                    }"
                    @click="toggleRhythmBeat(tIdx - 1)"
                  >
                    <q-icon
                      :name="userRhythm[tIdx - 1] === 'note' ? 'music_note' : 'volume_off'"
                      size="2.5rem"
                      :color="userRhythm[tIdx - 1] === 'note' ? 'primary' : 'secondary'"
                    />
                    <div class="text-subtitle2 text-weight-bold q-mt-sm">
                      {{ userRhythm[tIdx - 1] === 'note' ? 'Som 𝅘𝅥' : 'Silêncio 𝄽' }}
                    </div>
                    <div class="text-caption text-grey-6">Clique para alternar</div>
                  </q-card>
                </div>
              </div>

              <!-- Controles -->
              <div class="row justify-center q-gutter-md">
                <q-btn
                  :color="labPlaying ? 'negative' : 'primary'"
                  :icon="labPlaying ? 'stop' : 'play_arrow'"
                  :label="labPlaying ? 'Parar Reprodução' : 'Tocar Ritmo Criado 🚀'"
                  rounded
                  unelevated
                  class="q-px-xl"
                  @click="playUserRhythm"
                />
                <q-btn
                  flat
                  color="grey-7"
                  icon="refresh"
                  label="Resetar"
                  rounded
                  @click="resetUserRhythm"
                />
              </div>

              <div v-if="labPlaying" class="row justify-center q-mt-md text-subtitle1 text-weight-bold text-primary">
                Metrônomo ativo • Tempo {{ labBeat + 1 }}
              </div>
            </q-card-section>
          </q-card>
        </section>

      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { audioSynthesizer } from 'src/services/audio-synthesizer';

const $q = useQuasar();

// --- ESTADOS DO SIDEBAR ---
const activeSection = ref('introducao');

const sections = [
  { id: 'introducao', title: 'Silêncio na Música', icon: 'info' },
  { id: 'semibreve', title: 'Pausa de Semibreve', icon: 'remove_circle_outline' },
  { id: 'minima', title: 'Pausa de Mínima', icon: 'maximize' },
  { id: 'seminima', title: 'Pausa de Semínima', icon: 'graphic_eq' },
  { id: 'colcheia', title: 'Pausa de Colcheia', icon: 'waves' },
  { id: 'semicolcheia', title: 'Pausa de Semicolcheia', icon: 'blur_on' },
  { id: 'interativo', title: 'Ritmo Lab 🔬', icon: 'biotech' },
];

const scrollToSection = (id: string) => {
  activeSection.value = id;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// --- ESTADOS DE AUDIO ---
const playingId = ref<string | null>(null);
const currentBeat = ref(-1);
let playInterval: ReturnType<typeof setInterval> | null = null;

// Padrões de demonstração ritmica
// Representa 4 tempos em um compasso
const restItems = [
  {
    id: 'semibreve',
    symbol: '𝄻',
    title: 'Pausa de Semibreve',
    durationText: '4 Tempos (1 Compasso Completo)',
    description: `A <strong>Pausa de Semibreve</strong> representa o silêncio absoluto durante um compasso inteiro em fórmula 4/4. Ela é representada graficamente como um pequeno <strong>retângulo pendurado na quarta linha da pauta</strong> (de cima para baixo). No canto, a semibreve representa a pausa mais longa, frequentemente usada em transições de estrofes para que a prega vocal descanse por completo.`,
    examplePattern: [
      { isRest: true, duration: 1.0 },
      { isRest: true, duration: 1.0 },
      { isRest: true, duration: 1.0 },
      { isRest: true, duration: 1.0 },
    ]
  },
  {
    id: 'minima',
    symbol: '𝄼',
    title: 'Pausa de Mínima',
    durationText: '2 Tempos',
    description: `A <strong>Pausa de Mínima</strong> possui exatamente metade da duração da semibreve (2 tempos). Graficamente, é desenhada como um <strong>retângulo que fica em cima da terceira linha da pauta</strong> (parecendo um "chapéu" virado para cima). Na demonstração, você ouvirá som nos dois primeiros tempos e silêncio absoluto nos tempos 3 e 4.`,
    examplePattern: [
      { isRest: false, duration: 1.0 },
      { isRest: false, duration: 1.0 },
      { isRest: true, duration: 1.0 },
      { isRest: true, duration: 1.0 },
    ]
  },
  {
    id: 'seminima',
    symbol: '𝄽',
    title: 'Pausa de Semínima',
    durationText: '1 Tempo',
    description: `A <strong>Pausa de Semínima</strong> equivale a 1 tempo inteiro (1 batida do metrônomo). Graficamente, ela possui um design clássico de ziguezague estilizado. É a pausa mais comum em exercícios de vocalizes iniciantes, intercalando uma nota de sustentação longa com um tempo livre para relaxamento e retomada rápida de ar.`,
    examplePattern: [
      { isRest: false, duration: 1.0 },
      { isRest: true, duration: 1.0 },
      { isRest: false, duration: 1.0 },
      { isRest: true, duration: 1.0 },
    ]
  },
  {
    id: 'colcheia',
    symbol: '𝄾',
    title: 'Pausa de Colcheia',
    durationText: 'Meio Tempo (0.5)',
    description: `A <strong>Pausa de Colcheia</strong> representa apenas meio tempo (0.5). Ela possui uma haste inclinada com um gancho ou colchete. Introduz contratempos e padrões sincopados na melodia. Muito usada em escalas rápidas de agilidade vocal, onde o cantor precisa de micro-pausas para articular melhor as consoantes e vogais da letra.`,
    examplePattern: [
      { isRest: false, duration: 0.5 },
      { isRest: true, duration: 0.5 },
      { isRest: false, duration: 0.5 },
      { isRest: true, duration: 0.5 },
      { isRest: false, duration: 0.5 },
      { isRest: true, duration: 0.5 },
      { isRest: false, duration: 0.5 },
      { isRest: true, duration: 0.5 },
    ]
  },
  {
    id: 'semicolcheia',
    symbol: '𝄿',
    title: 'Pausa de Semicolcheia',
    durationText: 'Um Quarto de Tempo (0.25)',
    description: `A <strong>Pausa de Semicolcheia</strong> dura apenas um quarto de tempo (0.25) e tem dois ganchos em sua haste. Ela representa um corte extremamente ágil e abrupto do som. Cantores de melismas e *runs* de R&B/Gospel utilizam a subdivisão de semicolcheia para fatiar notas rápidas com incrível precisão de afinação.`,
    examplePattern: [
      { isRest: false, duration: 0.25 },
      { isRest: false, duration: 0.25 },
      { isRest: true, duration: 0.25 },
      { isRest: true, duration: 0.25 },
      { isRest: false, duration: 0.25 },
      { isRest: false, duration: 0.25 },
      { isRest: true, duration: 0.25 },
      { isRest: true, duration: 0.25 },
    ]
  }
];

const stopAllPlaybacks = () => {
  if (playInterval) {
    clearInterval(playInterval);
    playInterval = null;
  }
  audioSynthesizer.stopAll();
  playingId.value = null;
  currentBeat.value = -1;
  labPlaying.value = false;
  labBeat.value = -1;
};

const playAudioExample = (item: typeof restItems[0]) => {
  if (playingId.value === item.id) {
    stopAllPlaybacks();
    return;
  }

  stopAllPlaybacks();
  playingId.value = item.id;
  currentBeat.value = 0;

  const playSequence = async () => {
    const pattern = item.examplePattern;
    for (let i = 0; i < pattern.length; i++) {
      if (playingId.value !== item.id) break;
      currentBeat.value = i;
      const note = pattern[i];
      if (!note) continue;

      // Metrônomo no fundo (Beep de metrônomo em C5, curtinho)
      void audioSynthesizer.playNote(523.25, 0.02);

      if (!note.isRest) {
        // Toca Nota C4 (Dó Central = 261.63Hz)
        void audioSynthesizer.playNote(261.63, note.duration * 0.95);
      }

      await new Promise((resolve) => setTimeout(resolve, note.duration * 1000));
    }

    if (playingId.value === item.id) {
      // Loop automático
      void playSequence();
    }
  };

  void playSequence();
};

// --- LABORATÓRIO DE RITMO COMPOSER ---
const userRhythm = ref<('note' | 'rest')[]>(['note', 'note', 'rest', 'note']);
const labPlaying = ref(false);
const labBeat = ref(-1);

const toggleRhythmBeat = (idx: number) => {
  if (labPlaying.value) return;
  userRhythm.value[idx] = userRhythm.value[idx] === 'note' ? 'rest' : 'note';
};

const resetUserRhythm = () => {
  stopAllPlaybacks();
  userRhythm.value = ['note', 'note', 'rest', 'note'];
};

const playUserRhythm = () => {
  if (labPlaying.value) {
    stopAllPlaybacks();
    return;
  }

  stopAllPlaybacks();
  labPlaying.value = true;
  labBeat.value = 0;

  const playLabSequence = async () => {
    const beatSec = 0.8; // 800ms por tempo (BPM = 75)
    for (let i = 0; i < 4; i++) {
      if (!labPlaying.value) break;
      labBeat.value = i;
      const isRest = userRhythm.value[i] === 'rest';

      // Clique forte de Metrônomo
      void audioSynthesizer.playNote(587.33, 0.03); // D5 metrônomo

      if (!isRest) {
        // Toca Nota C4 (261.63 Hz)
        void audioSynthesizer.playNote(261.63, beatSec * 0.95);
      }

      await new Promise((resolve) => setTimeout(resolve, beatSec * 1000));
    }

    if (labPlaying.value) {
      void playLabSequence();
    }
  };

  void playLabSequence();
};

// --- SCROLL SPY LIVENESS ---
const handleScroll = () => {
  // Se chegou próximo ao final da rolagem da página (limite físico do navegador),
  // ativa automaticamente a última seção (Laboratório de Ritmos / interativo)
  const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 30;
  if (isBottom) {
    activeSection.value = sections[sections.length - 1]?.id || 'interativo';
    return;
  }

  const scrollTargets = document.querySelectorAll('.scroll-target');
  let currentSec = 'introducao';
  const offset = 180; // Margem para mudança ativa

  scrollTargets.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= offset) {
      currentSec = el.id;
    }
  });

  activeSection.value = currentSec;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  stopAllPlaybacks();
});
</script>

<style scoped>
.max-width-container {
  width: 100%;
  max-width: 1100px;
}

.border-radius-16 {
  border-radius: 16px;
}

.border-radius-12 {
  border-radius: 12px;
}

.border-radius-8 {
  border-radius: 8px;
}

.sticky-sidebar {
  position: sticky;
  top: 90px;
  max-height: calc(100vh - 120px);
}

.card-gradient-header {
  background: linear-gradient(135deg, var(--q-primary) 0%, #7e57c2 100%);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.bg-secondary .card-gradient-header {
  background: linear-gradient(135deg, var(--q-secondary) 0%, #0097a7 100%);
}

.line-height-18 {
  line-height: 1.7;
}

/* Cores customizadas translúcidas para cards de destaque */
.bg-primary-light-alpha {
  background-color: rgba(103, 58, 183, 0.08);
}
.bg-secondary-light-alpha {
  background-color: rgba(0, 188, 212, 0.08);
}
.bg-primary-light {
  background-color: rgba(103, 58, 183, 0.12);
}

.rest-symbol-display {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-family: serif;
}

/* Beats pulse indicador */
.beat-pulse-box {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background-color: #eeeeee;
  color: #757575;
  transition: all 0.2s ease;
  flex-direction: column;
}

.body--dark .beat-pulse-box {
  background-color: #333333;
  color: #bdbdbd;
}

.beat-pulse-box.active-beat {
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

.beat-pulse-box.active-beat.note-beat {
  background-color: var(--q-primary) !important;
  color: white !important;
}

.beat-pulse-box.active-beat.rest-beat {
  background-color: var(--q-secondary) !important;
  color: white !important;
}

/* Composer blocks */
.composer-block {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background-color: #fafafa;
}
.body--dark .composer-block {
  background-color: #1d1d1d;
  border: 1px solid #333;
}
.composer-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.active-composer-note {
  border: 2px solid var(--q-primary) !important;
}
.active-composer-rest {
  border: 2px solid var(--q-secondary) !important;
}

.pulse-active {
  animation: pulseComposer 0.8s infinite alternate;
}
@keyframes pulseComposer {
  from { transform: scale(1); }
  to { transform: scale(1.05); border-color: #ff9800 !important; }
}

.glass-card {
  backdrop-filter: blur(10px);
}
</style>
