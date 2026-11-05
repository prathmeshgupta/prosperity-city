/**
 * Procedural Lo-Fi Ambient Background Music (BGM) Engine for Prosperity City.
 * Generates smooth, soothing Rhodes-style electric piano chords and gentle ambient chimes
 * using pure Web Audio API synthesis. Zero external audio files required.
 */

export class AmbientMusicEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.25; // gentle background volume
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private currentMode: 'DAY' | 'NIGHT' = 'DAY';
  private chordIndex: number = 0;

  // Day Lo-Fi Chords: Cmaj9 -> Am9 -> Dm9 -> G13 (frequencies in Hz)
  private dayChords = [
    [130.81, 261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9 (C3, C4, E4, G4, B4, D5)
    [110.00, 220.00, 261.63, 329.63, 392.00, 493.88], // Am9 (A2, A3, C4, E4, G4, B4)
    [146.83, 293.66, 349.23, 440.00, 523.25, 587.33], // Dm9 (D3, D4, F4, A4, C5, D5)
    [98.00, 196.00, 261.63, 329.63, 440.00, 523.25],  // G13 (G2, G3, C4, E4, A4, C5)
  ];

  // Night Ambient Chords: Fmaj7#11 -> Em9 -> Dm9 -> Cmaj7
  private nightChords = [
    [87.31, 174.61, 261.63, 329.63, 369.99, 523.25], // Fmaj7#11 (F2, F3, C4, E4, F#4, C5)
    [82.41, 164.81, 246.94, 329.63, 392.00, 493.88], // Em9 (E2, E3, B3, E4, G4, B4)
    [73.42, 146.83, 220.00, 293.66, 349.23, 440.00], // Dm9 (D2, D3, A3, D4, F4, A4)
    [65.41, 130.81, 196.00, 246.94, 329.63, 392.00], // Cmaj7 (C2, C3, G3, B3, E4, G4)
  ];

  constructor() {
    // Lazy AudioContext initialization
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

  public setMode(mode: 'DAY' | 'NIGHT') {
    this.currentMode = mode;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public isAudioMuted(): boolean {
    return this.isMuted;
  }

  public start() {
    if (this.isPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.scheduleNextChord();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduleNextChord() {
    if (!this.isPlaying || !this.ctx) return;

    const chords = this.currentMode === 'DAY' ? this.dayChords : this.nightChords;
    const currentChord = chords[this.chordIndex % chords.length];
    this.chordIndex = (this.chordIndex + 1) % chords.length;

    const chordDuration = this.currentMode === 'DAY' ? 3.8 : 4.6; // seconds per chord
    this.playLoFiChord(currentChord, chordDuration);

    // Optional gentle pentatonic chime overlay on 2nd and 4th beats
    if (Math.random() < 0.65) {
      const chimeDelay = Math.random() * 1.8 + 0.8;
      window.setTimeout(() => {
        if (this.isPlaying) {
          const chimeFreq = currentChord[Math.floor(Math.random() * currentChord.length)] * 2;
          this.playAmbientChime(chimeFreq);
        }
      }, chimeDelay * 1000);
    }

    this.timerId = window.setTimeout(() => {
      this.scheduleNextChord();
    }, (chordDuration - 0.2) * 1000);
  }

  /**
   * Synthesize a warm, vintage Rhodes / electric piano chord
   */
  private playLoFiChord(frequencies: number[], duration: number) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Warm Low-Pass Filter (removes harsh digital high frequencies)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(this.currentMode === 'DAY' ? 880 : 640, now);
    filter.Q.setValueAtTime(1.2, now);
    filter.connect(this.masterGain);

    frequencies.forEach((freq, idx) => {
      if (!this.ctx) return;

      // Slight humanization strum offset (15ms between strings)
      const noteTime = now + idx * 0.022;

      // Primary tone: warm sine wave
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, noteTime);

      // Secondary tone: soft triangle wave for electric piano bite
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.002, noteTime); // subtle chorus detune

      // Note Gain Envelope
      const noteGain = this.ctx.createGain();
      const baseAmp = 0.045 / Math.sqrt(frequencies.length);

      noteGain.gain.setValueAtTime(0.001, noteTime);
      noteGain.gain.exponentialRampToValueAtTime(baseAmp, noteTime + 0.08); // soft attack
      noteGain.gain.exponentialRampToValueAtTime(baseAmp * 0.45, noteTime + 1.2); // sustain
      noteGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration); // gentle decay

      osc1.connect(noteGain);
      osc2.connect(noteGain);
      noteGain.connect(filter);

      osc1.start(noteTime);
      osc2.start(noteTime);
      osc1.stop(noteTime + duration + 0.1);
      osc2.stop(noteTime + duration + 0.1);
    });
  }

  /**
   * Delicate high-register vibraphone chime
   */
  private playAmbientChime(frequency: number) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.02, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.7);
  }
}

// Global singleton instance
export const ambientMusic = new AmbientMusicEngine();
