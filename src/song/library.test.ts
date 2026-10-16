import { describe, expect, test } from 'vitest';
import { KEYBOARD_RANGE } from '../keyboard/keyboard-range';
import { SONGS } from './library';

describe('song library', () => {
  test('every song fits on the on-screen keyboard', () => {
    SONGS.forEach((song) => {
      const outOfRange = song
        .lesson()
        .upcoming(Infinity)
        .filter((pitch) => !KEYBOARD_RANGE.contains(pitch))
        .map((pitch) => pitch.name());

      expect(outOfRange, song.id).toEqual([]);
    });
  });

  test('song ids are unique', () => {
    const ids = SONGS.map((song) => song.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
