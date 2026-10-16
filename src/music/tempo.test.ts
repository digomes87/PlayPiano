import { describe, expect, test } from 'vitest';
import { Tempo } from './tempo';

describe('Tempo', () => {
  test('one beat at 60 bpm lasts one second', () => {
    expect(new Tempo(60).millisecondsFor(1)).toBe(1000);
  });

  test('half a beat at 120 bpm lasts a quarter second', () => {
    expect(new Tempo(120).millisecondsFor(0.5)).toBe(250);
  });

  test('rejects non-positive tempos', () => {
    expect(() => new Tempo(0)).toThrow(RangeError);
    expect(() => new Tempo(-10)).toThrow(RangeError);
  });
});
