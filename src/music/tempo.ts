const MILLISECONDS_PER_MINUTE = 60_000;

/** Playback speed in beats per minute. */
export class Tempo {
  private readonly beatsPerMinute: number;

  constructor(beatsPerMinute: number) {
    if (!(beatsPerMinute > 0)) {
      throw new RangeError(`Invalid tempo: ${beatsPerMinute}`);
    }
    this.beatsPerMinute = beatsPerMinute;
  }

  millisecondsFor(beats: number): number {
    return (beats * MILLISECONDS_PER_MINUTE) / this.beatsPerMinute;
  }
}
