/**
 * Grand Theft Capital - In-Vehicle & Handheld Radio Station Engine
 * Synthesizes 4 distinct radio stations using pure Web Audio API synthesis:
 * 1. K-CAPITAL 98.5 (Market Talk, Wall Street satire, Fed rate jokes & commercials)
 * 2. VICE SYNTHWAVE 105.7 (Heavy 80s arpeggiated bass, retro lead synthesizers)
 * 3. LO-FI CAPITAL 91.2 (Jazzy Rhodes chords, vinyl warmth, chill beat)
 * 4. THE PIT TECHNO 102.4 (High-energy 130 BPM trading floor acid pulses)
 * 5. OFF (Engine rumble only)
 */

export interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  genre: string;
  description: string;
  color: string;
  currentTrack: string;
}

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'k_capital',
    name: 'K-CAPITAL TALK',
    frequency: '98.5 FM',
    genre: 'Financial Satire & Market Radio',
    description: 'The ruthless voice of Wall Street. Macro analysis, Fed jokes, and gold bullion ads.',
    color: '#f59e0b',
    currentTrack: 'The Morning Margin Call with Gordon Greed',
  },
  {
    id: 'vice_synth',
    name: 'VICE SYNTHWAVE',
    frequency: '105.7 FM',
    genre: 'Retro Outrun & Neon 80s',
    description: 'Driving through neon avenues at 120 MPH with analog synthesizers.',
    color: '#ec4899',
    currentTrack: 'Midnight Ocean Highway',
  },
  {
    id: 'lofi_flow',
    name: 'LO-FI CAPITAL',
    frequency: '91.2 FM',
    genre: 'Chillhop & Rhodes Beats',
    description: 'Smooth electric piano chords to build generational wealth to.',
    color: '#10b981',
    currentTrack: 'Compound Interest & Rain',
  },
  {
    id: 'the_pit',
    name: 'THE PIT TECHNO',
    frequency: '102.4 FM',
    genre: 'High-Frequency Acid Techno',
    description: '130 BPM adrenaline for high-stakes options day-trading and street racing.',
    color: '#8b5cf6',
    currentTrack: 'Algorithmic Liquidity Surge',
  },
  {
    id: 'off',
    name: 'RADIO OFF',
    frequency: '---',
    genre: 'Silence',
    description: 'Only the purr of the V8 exhaust and tires on pavement.',
    color: '#64748b',
    currentTrack: 'Muted',
  },
];

export class RadioEngine {
  private ctx: AudioContext | null = null;
  private currentStationIdx: number = 1; // Default to Vice Synthwave
  private isMuted: boolean = false;
  private volume: number = 0.28;
  private masterGain: GainNode | null = null;
  private stepTimer: number | null = null;
  private beatStep: number = 0;
  private listeners: ((station: RadioStation) => void)[] = [];

  constructor() {
    // Lazy AudioContext
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(cb: (station: RadioStation) => void) {
    this.listeners.push(cb);
    cb(this.getCurrentStation());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    const station = this.getCurrentStation();
    this.listeners.forEach((l) => l(station));
  }

  public getCurrentStation(): RadioStation {
    return RADIO_STATIONS[this.currentStationIdx];
  }

  public setStation(id: string) {
    const idx = RADIO_STATIONS.findIndex((s) => s.id === id);
    if (idx !== -1) {
      this.playTuningStatic();
      this.currentStationIdx = idx;
      this.beatStep = 0;
      this.notify();
    }
  }

  public nextStation(): RadioStation {
    this.playTuningStatic();
    this.currentStationIdx = (this.currentStationIdx + 1) % RADIO_STATIONS.length;
    this.beatStep = 0;
    this.notify();
    return this.getCurrentStation();
  }

  public prevStation(): RadioStation {
    this.playTuningStatic();
    this.currentStationIdx = (this.currentStationIdx - 1 + RADIO_STATIONS.length) % RADIO_STATIONS.length;
    this.beatStep = 0;
    this.notify();
    return this.getCurrentStation();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  /**
   * Authentic FM radio dial static whoosh when switching stations
   */
  private playTuningStatic() {
    try {
      this.initCtx();
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.12; // 120ms burst
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.12);
    } catch {
      // fallback
    }
  }

  public start() {
    this.initCtx();
    if (this.stepTimer) return;

    // 120 BPM step loop (~125ms per 16th note)
    this.stepTimer = window.setInterval(() => {
      this.onBeat();
    }, 130);
  }

  public stop() {
    if (this.stepTimer) {
      clearInterval(this.stepTimer);
      this.stepTimer = null;
    }
  }

  private onBeat() {
    if (!this.ctx || this.isMuted) return;
    const cur = this.getCurrentStation();
    if (cur.id === 'off') return;

    this.beatStep = (this.beatStep + 1) % 32;
    const now = this.ctx.currentTime;

    try {
      if (cur.id === 'vice_synth') {
        this.synthesizeViceSynth(now, this.beatStep);
      } else if (cur.id === 'the_pit') {
        this.synthesizeThePit(now, this.beatStep);
      } else if (cur.id === 'lofi_flow') {
        this.synthesizeLoFiFlow(now, this.beatStep);
      } else if (cur.id === 'k_capital') {
        this.synthesizeKCapital(now, this.beatStep);
      }
    } catch {
      // Audio fallback
    }
  }

  private synthesizeViceSynth(now: number, step: number) {
    if (!this.ctx || !this.masterGain) return;
    // 80s Synth Bassline: F2 -> G#2 -> A#2 -> C3
    const bassNotes = [87.31, 87.31, 103.83, 116.54, 87.31, 103.83, 116.54, 130.81];
    const note = bassNotes[step % bassNotes.length];

    if (step % 2 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.18);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.2);
    }

    // Synth Arp Lead every 4th step
    if (step % 4 === 2) {
      const leadNotes = [349.23, 415.30, 466.16, 523.25, 698.46];
      const leadNote = leadNotes[(step / 4) % leadNotes.length];
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      leadOsc.type = 'square';
      leadOsc.frequency.setValueAtTime(leadNote, now);
      leadGain.gain.setValueAtTime(0.08, now);
      leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      leadOsc.connect(leadGain);
      leadGain.connect(this.masterGain);
      leadOsc.start(now);
      leadOsc.stop(now + 0.25);
    }
  }

  private synthesizeThePit(now: number, step: number) {
    if (!this.ctx || !this.masterGain) return;
    // Heavy 130 BPM 4-on-the-floor kick on every 4th step
    if (step % 4 === 0) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(140, now);
      kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
      kickGain.gain.setValueAtTime(0.4, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      kickOsc.connect(kickGain);
      kickGain.connect(this.masterGain);
      kickOsc.start(now);
      kickOsc.stop(now + 0.15);
    }

    // Acid 303 Sawtooth Pulse
    if (step % 2 === 1) {
      const acidNotes = [110, 110, 130.81, 146.83, 164.81, 220];
      const acid = acidNotes[(step * 3) % acidNotes.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(acid, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.14);
      filter.Q.setValueAtTime(7.0, now);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.15);
    }
  }

  private synthesizeLoFiFlow(now: number, step: number) {
    if (!this.ctx || !this.masterGain) return;
    // Gentle jazzy Rhodes chords played on step 0 and 16
    if (step === 0 || step === 16) {
      const chord = step === 0 ? [261.63, 329.63, 392.0, 493.88] : [220.0, 261.63, 329.63, 392.0];
      chord.forEach((f) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now);
        osc.stop(now + 1.6);
      });
    }
  }

  private synthesizeKCapital(now: number, step: number) {
    if (!this.ctx || !this.masterGain) return;
    // Radio broadcast jingle & periodic news bulletin chimes
    if (step === 0) {
      [659.25, 523.25, 783.99].forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.1);
        gain.gain.setValueAtTime(0.1, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.32);
      });
    }
  }
}

export const radioEngine = new RadioEngine();
