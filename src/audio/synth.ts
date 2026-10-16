import type { Pitch } from '../music/pitch';
import { OscillatorVoice, SILENT_VOICE, type Voice } from './voice';

const PEAK_GAIN = 0.3;
const ATTACK_SECONDS = 0.008;
const DECAY_SECONDS = 2.5;
const SILENCE = 0.0001;
const OVERTONE_RATIO = 2;
const OVERTONE_LEVEL = 0.25;

/**
 * Small piano-like synthesizer: a triangle fundamental plus a quiet octave overtone,
 * with a fast attack and a natural decay. The AudioContext is created on the first
 * note because iPad Safari only allows audio to start inside a user gesture.
 */
export class Synth {
  private context: AudioContext | null = null;

  start(pitch: Pitch): Voice {
    if (typeof AudioContext === 'undefined') {
      return SILENT_VOICE;
    }
    const context = this.audioContext();
    const envelope = this.envelope(context);
    const oscillators = [
      this.oscillator(context, 'triangle', pitch.frequency(), envelope),
      this.overtone(context, pitch.frequency() * OVERTONE_RATIO, envelope),
    ];
    return new OscillatorVoice(oscillators, envelope);
  }

  private audioContext(): AudioContext {
    this.context ??= new AudioContext();
    if (this.context.state === 'suspended') {
      void this.context.resume();
    }
    return this.context;
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
