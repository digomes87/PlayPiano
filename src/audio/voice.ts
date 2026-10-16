const RELEASE_SECONDS = 0.25;
const SILENCE = 0.0001;

/** One sounding note. */
export interface Voice {
  stop(): void;
}

/** Used where Web Audio is unavailable: the key still lights, it just makes no sound. */
export const SILENT_VOICE: Voice = { stop: () => {} };

/** A note backed by oscillators. Fades out and frees them when stopped. */
export class OscillatorVoice implements Voice {
  private readonly oscillators: OscillatorNode[];
  private readonly envelope: GainNode;

  constructor(oscillators: OscillatorNode[], envelope: GainNode) {
    this.oscillators = oscillators;
    this.envelope = envelope;
  }

  stop(): void {
    const now = this.envelope.context.currentTime;
    const gain = this.envelope.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(Math.max(gain.value, SILENCE), now);
    gain.exponentialRampToValueAtTime(SILENCE, now + RELEASE_SECONDS);
    this.oscillators.forEach((oscillator) => oscillator.stop(now + RELEASE_SECONDS));
  }
}
