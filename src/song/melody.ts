import { Pitch } from '../music/pitch';

const TOKEN_SEPARATOR = /[\s|]+/;
const TOKEN_PATTERN = /^([^:]+):([0-9]*\.?[0-9]+)$/;

export interface SongNote {
  readonly pitch: Pitch;
  readonly beats: number;
}

/**
 * Ordered notes of a song. Parsed from a compact score such as
 * `E4:1 E4:1 F4:1 G4:1 | G4:1`, where each token is `pitch:beats`
 * and `|` marks a bar line for readability only.
 */
export class Melody {
  private readonly notes: readonly SongNote[];

  private constructor(notes: readonly SongNote[]) {
    this.notes = notes;
  }

  static parse(score: string): Melody {
    const tokens = score.split(TOKEN_SEPARATOR).filter((token) => token.length > 0);
    if (tokens.length === 0) {
      throw new RangeError('Score has no notes');
    }
    return new Melody(tokens.map(parseToken));
  }

  length(): number {
    return this.notes.length;
  }

  noteAt(index: number): SongNote | undefined {
    return this.notes[index];
  }

  slice(start: number, count: number): SongNote[] {
    return this.notes.slice(start, start + count);
  }
}

function parseToken(token: string): SongNote {
  const match = TOKEN_PATTERN.exec(token);
  const beats = Number(match?.[2]);
  if (!match || !(beats > 0)) {
    throw new RangeError(`Invalid score token: ${token}`);
  }
  return { pitch: Pitch.parse(match[1]), beats };
}
