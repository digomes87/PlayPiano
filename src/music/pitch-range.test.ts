import { describe, expect, test } from 'vitest';
import { Pitch } from './pitch';
import { PitchRange } from './pitch-range';

describe('PitchRange', () => {
  test('lists every semitone from lowest to highest inclusive', () => {
    const range = new PitchRange(Pitch.parse('C4'), Pitch.parse('E4'));

    const names = range.pitches().map((pitch) => pitch.name());

    expect(names).toEqual(['C4', 'C#4', 'D4', 'D#4', 'E4']);
  });

  test('two octaves plus the top note hold 25 keys', () => {
    const range = new PitchRange(Pitch.parse('C4'), Pitch.parse('C6'));

    expect(range.pitches()).toHaveLength(25);
  });

  test('rejects a range whose lowest note is above the highest', () => {
    expect(() => new PitchRange(Pitch.parse('C5'), Pitch.parse('C4'))).toThrow(RangeError);
  });
});

describe('PitchRange.contains', () => {
  const range = new PitchRange(Pitch.parse('C4'), Pitch.parse('C6'));

  test('includes both ends', () => {
    expect(range.contains(Pitch.parse('C4'))).toBe(true);
    expect(range.contains(Pitch.parse('C6'))).toBe(true);
  });

  test('excludes pitches outside', () => {
    expect(range.contains(Pitch.parse('B3'))).toBe(false);
    expect(range.contains(Pitch.parse('C#6'))).toBe(false);
  });
});
