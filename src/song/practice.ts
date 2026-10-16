import type { Pitch } from '../music/pitch';
import type { Lesson } from './lesson';
import type { Song } from './song';

/** A song together with the learner's progress through it. Immutable. */
export class Practice {
  readonly song: Song;
  readonly lesson: Lesson;

  private constructor(song: Song, lesson: Lesson) {
    this.song = song;
    this.lesson = lesson;
  }

  static of(song: Song): Practice {
    return new Practice(song, song.lesson());
  }

  accepts(pitch: Pitch): boolean {
    return this.lesson.accepts(pitch);
  }

  isFinished(): boolean {
    return this.lesson.isFinished();
  }

  /** How long the note about to be played should be held. */
  expectedNoteLength(): number {
    return this.song.durationOf(this.lesson.expectedBeats());
  }

  advance(): Practice {
    return new Practice(this.song, this.lesson.advance());
  }

  restart(): Practice {
    return Practice.of(this.song);
  }
}
