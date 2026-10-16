import type { PitchRange } from '../music/pitch-range';
import { PianoKey } from './piano-key';

/** Every key of the keyboard, in pitch order. */
export class PianoKeys {
  private readonly keys: PianoKey[];

  private constructor(keys: PianoKey[]) {
    this.keys = keys;
  }

  static forRange(range: PitchRange): PianoKeys {
    let whiteKeysBefore = 0;
    const keys = range.pitches().map((pitch) => {
      const key = PianoKey.create(pitch, whiteKeysBefore);
      whiteKeysBefore += key.isWhite() ? 1 : 0;
      return key;
    });
    return new PianoKeys(keys);
  }

  whiteCount(): number {
    return this.keys.filter((key) => key.isWhite()).length;
  }

  mountInto(container: HTMLElement): void {
    this.keys.forEach((key) => key.mountInto(container));
  }

  ownerOf(element: Element | null): PianoKey | undefined {
    return this.keys.find((key) => key.owns(element));
  }
}
