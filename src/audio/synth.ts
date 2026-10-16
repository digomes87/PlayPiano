import type { Pitch } from '../music/pitch';
import { OscillatorVoice, SILENT_VOICE, type Voice } from './voice';

const PEAK_GAIN = 0.3;
const ATTACK_SECONDS = 0.008;
const DECAY_SECONDS = 2.5;
const SILENCE = 0.0001;
const OVERTONE_RATIO = 2;
const OVERTONE_LEVEL = 0.25;
const SILENT_BUFFER_SAMPLE_RATE = 22050;

type AudioContextFactory = () => AudioContext | null;

const browserAudioContext: AudioContextFactory = () =>
  typeof AudioContext === 'undefined' ? null : new AudioContext();

/**
 * Small piano-like synthesizer: a triangle fundamental plus a quiet octave overtone,
 * with a fast attack and a natural decay.
 *
 * iPad Safari keeps audio suspended until an activation gesture (finger lifted, click,
 * key press). Touching down is not one, so `unlock` must be called from those events;
 * it is safe to call on every gesture and also recovers from system interruptions.
 */
export class Synth {
  private readonly createContext: AudioContextFactory;
  private context: AudioContext | null = null;

  constructor(createContext: AudioContextFactory = browserAudioContext) {
    this.createContext = createContext;
  }

  unlock(): void {
    const context = this.audioContext();
    if (!context || context.state === 'running') {
      return;
    }
    // Rejected outside a gesture; the next gesture calls unlock again.
    context.resume().catch(() => undefined);
    this.playSilence(context);
  }

  start(pitch: Pitch): Voice {
    const context = this.audioContext();
    if (!context) {
      return SILENT_VOICE;
    }
    this.unlock();
    const envelope = this.envelope(context);
    const oscillators = [
      this.oscillator(context, 'triangle', pitch.frequency(), envelope),
      this.overtone(context, pitch.frequency() * OVERTONE_RATIO, envelope),
    ];
    return new OscillatorVoice(oscillators, envelope);
  }

  private audioContext(): AudioContext | null {
    this.context ??= this.createContext();
    return this.context;
  }

  // Older iOS versions only unlock audio once a sound has actually been started in a gesture.
  private playSilence(context: AudioContext): void {
    const source = context.createBufferSource();
    source.buffer = context.createBuffer(1, 1, SILENT_BUFFER_SAMPLE_RATE);
    source.connect(context.destination);
    source.start(0);
  }

  private envelope(context: AudioContext): GainNode {
    const envelope = context.createGain();
    const now = context.currentTime;
    envelope.gain.setValueAtTime(SILENCE, now);
    envelope.gain.exponentialRampToValueAtTime(PEAK_GAIN, now + ATTACK_SECONDS);
    envelope.gain.exponentialRampToValueAtTime(SILENCE, now + ATTACK_SECONDS + DECAY_SECONDS);
    envelope.connect(context.destination);
    return envelope;
  }

  private overtone(context: AudioContext, frequency: number, output: AudioNode): OscillatorNode {
    const level = context.createGain();
    level.gain.value = OVERTONE_LEVEL;
    level.connect(output);
    return this.oscillator(context, 'sine', frequency, level);
  }

  private oscillator(
    context: AudioContext,
    type: OscillatorType,
    frequency: number,
    output: AudioNode,
  ): OscillatorNode {
    const oscillator = new OscillatorNode(context, { type, frequency });
    oscillator.connect(output);
    oscillator.start();
    return oscillator;
  }
}
