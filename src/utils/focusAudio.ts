/**
 * Ambient Focus Music & Soundscape Generator using Web Audio API.
 * Supports:
 * - 'lofi': Relaxing Lo-Fi study chords progression with warm sub-bass & soft melody
 * - 'rain': Soothing rain soundscape with filtered noise & gentle droplets
 * - 'cafe': Warm ambient coffee shop atmosphere
 * - 'alpha': 40Hz / 10Hz Binaural alpha wave for deep study
 */

export type FocusMusicTrack = 'none' | 'lofi' | 'rain' | 'cafe' | 'alpha';

export interface TrackInfo {
  id: FocusMusicTrack;
  title: string;
  desc: string;
  iconName: string;
}

export const TRACK_OPTIONS: TrackInfo[] = [
  { id: 'lofi', title: 'Lo-Fi Belajar', desc: 'Akord piano lo-fi santai', iconName: 'music' },
  { id: 'rain', title: 'Suara Hujan', desc: 'Rintik hujan & angin tenang', iconName: 'cloud-rain' },
  { id: 'cafe', title: 'Kafe Santai', desc: 'Suasana hangat ruang belajar', iconName: 'coffee' },
  { id: 'alpha', title: 'Gelombang Alpha', desc: 'Frekuensi fokus konsentrasi', iconName: 'headphones' },
];

class FocusAudioEngine {
  private ctx: AudioContext | null = null;
  private currentTrack: FocusMusicTrack = 'none';
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.6;

  // Active nodes & timers
  private activeNodes: (AudioNode | number)[] = [];
  private loopInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): FocusMusicTrack {
    return this.currentTrack;
  }

  public stop() {
    this.isPlaying = false;
    if (this.loopInterval) {
      window.clearInterval(this.loopInterval);
      this.loopInterval = null;
    }

    this.activeNodes.forEach((node) => {
      if (typeof node === 'number') {
        window.clearTimeout(node);
      } else {
        try {
          (node as AudioScheduledSourceNode).stop?.();
          node.disconnect();
        } catch {
          // ignore
        }
      }
    });
    this.activeNodes = [];
  }

  public play(track: FocusMusicTrack) {
    this.stop();
    if (track === 'none') {
      this.currentTrack = 'none';
      return;
    }

    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentTrack = track;
    this.isPlaying = true;

    if (track === 'rain') {
      this.startRainSound();
    } else if (track === 'cafe') {
      this.startCafeSound();
    } else if (track === 'alpha') {
      this.startAlphaWaveSound();
    } else if (track === 'lofi') {
      this.startLofiMusic();
    }
  }

  // --- 1. Rain Synthesizer ---
  private startRainSound() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Buffer pink noise generator
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to simulate soft raindrops
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.5, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, rainGain);

    // Random water drop splashes
    this.loopInterval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const dropOsc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      const dropFilter = this.ctx.createBiquadFilter();

      const freq = 1200 + Math.random() * 800;
      dropOsc.type = 'sine';
      dropOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      dropOsc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.12);

      dropGain.gain.setValueAtTime(0.01 + Math.random() * 0.04, this.ctx.currentTime);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

      dropOsc.connect(dropGain);
      dropGain.connect(this.masterGain);
      dropOsc.start();
      dropOsc.stop(this.ctx.currentTime + 0.14);
    }, 400);
  }

  // --- 2. Cafe Ambience Synthesizer ---
  private startCafeSound() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Warm low frequency rumble + soft tape hiss
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.04;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.activeNodes.push(noise, filter, gain);
  }

  // --- 3. Binaural Alpha Wave Synthesizer (40Hz / 10Hz) ---
  private startAlphaWaveSound() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Carrier frequency 216Hz and offset 226Hz for a 10Hz binaural alpha wave
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(216, ctx.currentTime);
    gain1.gain.setValueAtTime(0.18, ctx.currentTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(226, ctx.currentTime);
    gain2.gain.setValueAtTime(0.18, ctx.currentTime);

    osc1.connect(gain1);
    gain1.connect(this.masterGain);

    osc2.connect(gain2);
    gain2.connect(this.masterGain);

    osc1.start();
    osc2.start();

    this.activeNodes.push(osc1, osc2, gain1, gain2);
  }

  // --- 4. Lo-Fi Study Chords Synthesizer ---
  private startLofiMusic() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Gentle 4-chord study progression: Dmaj7 -> Bm7 -> Em7 -> A7sus
    const chords = [
      [146.83, 220.00, 277.18, 329.63], // D3, A3, C#4, E4
      [123.47, 185.00, 220.00, 293.66], // B2, F#3, A3, D4
      [164.81, 196.00, 246.94, 329.63], // E3, G3, B3, E4
      [110.00, 164.81, 220.00, 293.66], // A2, E3, A3, D4
    ];

    let chordIndex = 0;

    const playNextChord = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const currentNotes = chords[chordIndex];
      chordIndex = (chordIndex + 1) % chords.length;

      currentNotes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600 + i * 150, this.ctx!.currentTime);

        gain.gain.setValueAtTime(0.001, this.ctx!.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, this.ctx!.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 3.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(this.ctx!.currentTime);
        osc.stop(this.ctx!.currentTime + 4.0);
      });
    };

    // Play first chord immediately
    playNextChord();

    // Trigger chords every 4 seconds smoothly
    this.loopInterval = window.setInterval(() => {
      playNextChord();
    }, 4000);
  }
}

export const focusAudio = new FocusAudioEngine();
