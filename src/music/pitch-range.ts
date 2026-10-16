import type { Pitch } from './pitch';

/** Contiguous span of semitones, inclusive on both ends. */
export class PitchRange {
  private readonly lowest: Pitch;
  private readonly highest: Pitch;

  constructor(lowest: Pitch, highest: Pitch) {
    this.lowest = lowest;
    this.highest = highest;
    if (lowest.isAbove(highest)) {
      throw new RangeError(`Range starts above its end: ${lowest.name()} > ${highest.name()}`);
    }
  }

  contains(pitch: Pitch): boolean {
    return !this.lowest.isAbove(pitch) && !pitch.isAbove(this.highest);
  }

  pitches(): Pitch[] {
    const pitches = [this.lowest];
    while (!pitches[pitches.length - 1].equals(this.highest)) {
      pitches.push(pitches[pitches.length - 1].next());
    }
    return pitches;
  }
}
