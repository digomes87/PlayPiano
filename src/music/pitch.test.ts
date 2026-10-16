import { describe, expect, test } from 'vitest';
import { Pitch } from './pitch';

describe('Pitch', () => {
  test('parses natural and sharp note names', () => {
    expect(Pitch.parse('C4').name()).toBe('C4');
    expect(Pitch.parse('F#5').name()).toBe('F#5');
  });

  test('rejects malformed note names', () => {
    expect(() => Pitch.parse('H4')).toThrow(RangeError);
    expect(() => Pitch.parse('C')).toThrow(RangeError);
  });

  test('rejects midi numbers outside 0..127', () => {
    expect(() => Pitch.fromMidi(128)).toThrow(RangeError);
    expect(() => Pitch.fromMidi(-1)).toThrow(RangeError);
    expect(() => Pitch.fromMidi(60.5)).toThrow(RangeError);
  });

  test('A4 sounds at 440 Hz and A5 one octave above', () => {
    expect(Pitch.parse('A4').frequency()).toBe(440);
    expect(Pitch.parse('A5').frequency()).toBeCloseTo(880);
  });

  test('sharps are black keys, naturals are white keys', () => {
    expect(Pitch.parse('C#4').isSharp()).toBe(true);
    expect(Pitch.parse('E4').isSharp()).toBe(false);
  });

  test('next returns the following semitone', () => {
    expect(Pitch.parse('E4').next().name()).toBe('F4');
    expect(Pitch.parse('B3').next().name()).toBe('C4');
  });

  test('compares by pitch height', () => {
    expect(Pitch.parse('C5').isAbove(Pitch.parse('B4'))).toBe(true);
    expect(Pitch.parse('C4').equals(Pitch.fromMidi(60))).toBe(true);
  });
});

describe('Pitch class', () => {
  test('exposes the pitch class without octave for display', () => {
    expect(Pitch.parse('C#5').pitchClass()).toBe('C#');
    expect(Pitch.parse('A3').pitchClass()).toBe('A');
  });
});
