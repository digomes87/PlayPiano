import { describe, expect, test } from 'vitest';
import { Pitch } from '../music/pitch';
import { Melody } from './melody';

describe('Melody', () => {
  test('parses a score of pitch:beats tokens', () => {
    const melody = Melody.parse('E4:1 F#4:0.5  G4:2');

    expect(melody.length()).toBe(3);
    expect(melody.noteAt(1)?.pitch.equals(Pitch.parse('F#4'))).toBe(true);
    expect(melody.noteAt(1)?.beats).toBe(0.5);
  });

  test('accepts line breaks and bar separators in the score', () => {
    const melody = Melody.parse(`
      E4:1 E4:1 | F4:1 G4:1
      G4:1
    `);

    expect(melody.length()).toBe(5);
  });

  test('rejects tokens without a positive duration', () => {
    expect(() => Melody.parse('E4')).toThrow(RangeError);
    expect(() => Melody.parse('E4:0')).toThrow(RangeError);
    expect(() => Melody.parse('E4:x')).toThrow(RangeError);
  });

  test('rejects an empty score', () => {
    expect(() => Melody.parse('   ')).toThrow(RangeError);
  });

  test('returns undefined past the last note', () => {
    expect(Melody.parse('C4:1').noteAt(1)).toBeUndefined();
  });
});
