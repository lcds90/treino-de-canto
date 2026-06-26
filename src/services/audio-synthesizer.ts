// src/services/audio-synthesizer.ts

export class AudioSynthesizer {
  private audioCtx: AudioContext | null = null;
  private activeSources: { oscs: OscillatorNode[]; masterGain: GainNode; filterNode?: BiquadFilterNode }[] = [];
  private midiActiveSources: Map<number, { oscs: OscillatorNode[]; masterGain: GainNode; filterNode?: BiquadFilterNode }> = new Map();

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  // Tocador para notas com duração pré-definida
  playNote(frequency: number, duration = 0.5): Promise<void> {
    this.init();
    if (!this.audioCtx) return Promise.resolve();

    if (this.audioCtx.state === 'suspended') {
      void this.audioCtx.resume();
    }

    const now = this.audioCtx.currentTime;

    // Master gain node
    const masterGain = this.audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    // Ataque suave do martelo do piano
    masterGain.gain.linearRampToValueAtTime(0.5, now + 0.01);
    // Decaimento exponencial suave até o silêncio
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Filtro Passa-Baixa Dinâmico (Simula o abafamento físico das cordas agudas)
    const filterNode = this.audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(1400, now);
    filterNode.frequency.exponentialRampToValueAtTime(300, now + duration);

    // Harmônicos com Ondas Senoidais Puras (evita som estalado/retro de sintetizador)
    const harmonics = [
      { ratio: 1, gain: 0.6 },   // Fundamental
      { ratio: 2, gain: 0.22 },  // Oitava
      { ratio: 3, gain: 0.12 },  // Quinta
      { ratio: 4, gain: 0.05 },  // Segunda oitava
      { ratio: 5, gain: 0.02 }   // Terceira
    ];

    const oscs: OscillatorNode[] = [];

    harmonics.forEach(({ ratio, gain: harmonicGain }) => {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.value = frequency * ratio;
      oscGain.gain.value = harmonicGain;

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      oscs.push(osc);
    });

    masterGain.connect(filterNode);
    filterNode.connect(this.audioCtx.destination);

    const sourceObj = { oscs, masterGain, filterNode };
    this.activeSources.push(sourceObj);

    oscs.forEach((osc) => osc.start(now));
    oscs.forEach((osc) => osc.stop(now + duration));

    // Limpa a referência após finalizar
    return new Promise((resolve) => {
      setTimeout(() => {
        this.activeSources = this.activeSources.filter((s) => s !== sourceObj);
        resolve();
      }, duration * 1000);
    });
  }

  // Suporte a MIDI: Inicia nota contínua
  startMidiNote(midi: number, frequency: number) {
    this.init();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      void this.audioCtx.resume();
    }

    if (this.midiActiveSources.has(midi)) {
      this.stopMidiNote(midi);
    }

    const now = this.audioCtx.currentTime;
    const masterGain = this.audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.5, now + 0.01);
    masterGain.gain.linearRampToValueAtTime(0.2, now + 0.15);

    // Filtro Passa-Baixa para MIDI contínuo
    const filterNode = this.audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(1400, now);
    filterNode.frequency.exponentialRampToValueAtTime(450, now + 1.5); // decai ao longo do sustain

    const harmonics = [
      { ratio: 1, gain: 0.6 },
      { ratio: 2, gain: 0.22 },
      { ratio: 3, gain: 0.12 },
      { ratio: 4, gain: 0.05 },
      { ratio: 5, gain: 0.02 }
    ];

    const oscs: OscillatorNode[] = [];

    harmonics.forEach(({ ratio, gain: harmonicGain }) => {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.value = frequency * ratio;
      oscGain.gain.value = harmonicGain;

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      oscs.push(osc);
    });

    masterGain.connect(filterNode);
    filterNode.connect(this.audioCtx.destination);

    const sourceObj = { oscs, masterGain, filterNode };
    this.midiActiveSources.set(midi, sourceObj);

    oscs.forEach((osc) => osc.start(now));
  }

  // Suporte a MIDI: Para nota contínua com release suave
  stopMidiNote(midi: number) {
    const sourceObj = this.midiActiveSources.get(midi);
    if (!sourceObj) return;

    this.midiActiveSources.delete(midi);
    const now = this.audioCtx ? this.audioCtx.currentTime : 0;

    try {
      const { oscs, masterGain, filterNode } = sourceObj;
      if (masterGain && this.audioCtx) {
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(masterGain.gain.value, now);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      }
      if (filterNode && this.audioCtx) {
        filterNode.frequency.cancelScheduledValues(now);
        filterNode.frequency.setValueAtTime(filterNode.frequency.value, now);
        filterNode.frequency.exponentialRampToValueAtTime(100, now + 0.18);
      }
      setTimeout(() => {
        oscs.forEach((osc) => {
          try {
            osc.stop();
          } catch {
            // Já parou
          }
        });
      }, 250);
    } catch (error) {
      console.error('Erro ao parar nota MIDI:', error);
    }
  }

  stopAll() {
    const now = this.audioCtx ? this.audioCtx.currentTime : 0;

    // Para todas as notas temporárias
    this.activeSources.forEach(({ oscs, masterGain }) => {
      try {
        if (masterGain && this.audioCtx) {
          masterGain.gain.cancelScheduledValues(now);
          masterGain.gain.setValueAtTime(masterGain.gain.value, now);
          masterGain.gain.linearRampToValueAtTime(0, now + 0.05);
        }
        setTimeout(() => {
          oscs.forEach((osc) => {
            try {
              osc.stop();
            } catch {
              // Já parou
            }
          });
        }, 50);
      } catch (error) {
        console.error('Erro ao parar som:', error);
      }
    });
    this.activeSources = [];

    // Para todas as notas MIDI
    this.midiActiveSources.forEach(({ oscs, masterGain }) => {
      try {
        if (masterGain && this.audioCtx) {
          masterGain.gain.cancelScheduledValues(now);
          masterGain.gain.setValueAtTime(masterGain.gain.value, now);
          masterGain.gain.linearRampToValueAtTime(0, now + 0.05);
        }
        setTimeout(() => {
          oscs.forEach((osc) => {
            try {
              osc.stop();
            } catch {
              // Já parou
            }
          });
        }, 50);
      } catch (error) {
        console.error('Erro ao parar som MIDI:', error);
      }
    });
    this.midiActiveSources.clear();
  }
}

export const audioSynthesizer = new AudioSynthesizer();
