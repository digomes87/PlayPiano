const PITCH_CLASSES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
const SEMITONES_PER_OCTAVE = PITCH_CLASSES.length;
const LOWEST_MIDI = 0;
const HIGHEST_MIDI = 127;
const CONCERT_A_MIDI = 69;
const CONCERT_A_HERTZ = 440;
const MIDI_OCTAVE_OFFSET = 1;
const NOTE_NAME_PATTERN = /^([A-G]#?)(-?\d)$/;

export type PitchClass = (typeof PITCH_CLASSES)[number];

/** A single semitone on the keyboard, identified by its MIDI number. */
export class Pitch {
  private readonly midiNumber: number;

  private constructor(midiNumber: number) {
    this.midiNumber = midiNumber;
  }

  static fromMidi(midiNumber: number): Pitch {
    const isValid =
      Number.isInteger(midiNumber) && midiNumber >= LOWEST_MIDI && midiNumber <= HIGHEST_MIDI;
    if (!isValid) {
      throw new RangeError(`Invalid MIDI number: ${midiNumber}`);
    }
    return new Pitch(midiNumber);
  }

  static parse(noteName: string): Pitch {
    const match = NOTE_NAME_PATTERN.exec(noteName);
    if (!match) {
      throw new RangeError(`Invalid note name: ${noteName}`);
    }
    const pitchClassIndex = PITCH_CLASSES.indexOf(match[1] as PitchClass);
    if (pitchClassIndex < 0) {
      throw new RangeError(`Invalid note name: ${noteName}`);
    }
    const octave = Number(match[2]);
    return Pitch.fromMidi((octave + MIDI_OCTAVE_OFFSET) * SEMITONES_PER_OCTAVE + pitchClassIndex);
  }

  name(): string {
    const octave = Math.floor(this.midiNumber / SEMITONES_PER_OCTAVE) - MIDI_OCTAVE_OFFSET;
    return `${this.pitchClass()}${octave}`;
  }

  frequency(): number {
    const semitonesFromConcertA = this.midiNumber - CONCERT_A_MIDI;
    return CONCERT_A_HERTZ * 2 ** (semitonesFromConcertA / SEMITONES_PER_OCTAVE);
  }

  isSharp(): boolean {
    return this.pitchClass().endsWith('#');
  }

  next(): Pitch {
    return Pitch.fromMidi(this.midiNumber + 1);
  }

  isAbove(other: Pitch): boolean {
    return this.midiNumber > other.midiNumber;
  }

  equals(other: Pitch): boolean {
    return this.midiNumber === other.midiNumber;
  }

  pitchClass(): PitchClass {
    return PITCH_CLASSES[this.midiNumber % SEMITONES_PER_OCTAVE];
  }
}
