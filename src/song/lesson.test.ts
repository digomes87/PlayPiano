import { describe, expect, test } from 'vitest';
import { Pitch } from '../music/pitch';
import { Lesson } from './lesson';
import { Melody } from './melody';

const melody = Melody.parse('C4:1 D4:1 E4:1');

describe('Lesson', () => {
  test('starts expecting the first note', () => {
    const lesson = Lesson.start(melody);

    expect(lesson.expectedPitch()?.name()).toBe('C4');
    expect(lesson.playedCount()).toBe(0);
    expect(lesson.totalCount()).toBe(3);
  });

  test('accepts only the expected pitch', () => {
    const lesson = Lesson.start(melody);

    expect(lesson.accepts(Pitch.parse('C4'))).toBe(true);
    expect(lesson.accepts(Pitch.parse('D4'))).toBe(false);
  });

  test('advancing moves to the next note without changing the original lesson', () => {
    const first = Lesson.start(melody);

    const second = first.advance();

    expect(second.expectedPitch()?.name()).toBe('D4');
    expect(first.expectedPitch()?.name()).toBe('C4');
  });

  test('finishes after the last note and accepts nothing more', () => {
    const finished = Lesson.start(melody).advance().advance().advance();

    expect(finished.isFinished()).toBe(true);
    expect(finished.expectedPitch()).toBeUndefined();
    expect(finished.accepts(Pitch.parse('C4'))).toBe(false);
    expect(finished.advance().playedCount()).toBe(3);
  });

  test('lists the upcoming pitches starting at the expected one', () => {
    const lesson = Lesson.start(melody).advance();

    expect(lesson.upcoming(5).map((pitch) => pitch.name())).toEqual(['D4', 'E4']);
  });
});

describe('Lesson restart', () => {
  test('restart goes back to the first note', () => {
    const restarted = Lesson.start(melody).advance().advance().restart();

    expect(restarted.playedCount()).toBe(0);
    expect(restarted.expectedPitch()?.name()).toBe('C4');
  });
});

describe('Lesson notes', () => {
  const rhythmic = Melody.parse('C4:1 D4:0.5 E4:2');

  test('exposes the beats of the expected note', () => {
    expect(Lesson.start(rhythmic).advance().expectedBeats()).toBe(0.5);
  });

  test('a finished lesson expects no beats', () => {
    expect(Lesson.start(rhythmic).advance().advance().advance().expectedBeats()).toBe(0);
  });

  test('lists the remaining notes with their beats', () => {
    const remaining = Lesson.start(rhythmic).advance().remainingNotes();

    expect(remaining.map((note) => `${note.pitch.name()}:${note.beats}`)).toEqual(['D4:0.5', 'E4:2']);
  });
});
