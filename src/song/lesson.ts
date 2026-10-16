import type { Pitch } from '../music/pitch';
import type { Melody, SongNote } from './melody';

/** Progress of a learner through a melody. Immutable: advancing returns a new lesson. */
export class Lesson {
  private readonly melody: Melody;
  private readonly position: number;

  private constructor(melody: Melody, position: number) {
    this.melody = melody;
    this.position = position;
  }

  static start(melody: Melody): Lesson {
    return new Lesson(melody, 0);
  }

  expectedPitch(): Pitch | undefined {
    return this.melody.noteAt(this.position)?.pitch;
  }

  expectedBeats(): number {
    return this.melody.noteAt(this.position)?.beats ?? 0;
  }

  remainingNotes(): SongNote[] {
    return this.melody.slice(this.position, Infinity);
  }

  accepts(pitch: Pitch): boolean {
    return this.expectedPitch()?.equals(pitch) ?? false;
  }

  advance(): Lesson {
    if (this.isFinished()) {
      return this;
    }
    return new Lesson(this.melody, this.position + 1);
  }

  restart(): Lesson {
    return Lesson.start(this.melody);
  }

  isFinished(): boolean {
    return this.position >= this.melody.length();
  }

  playedCount(): number {
    return this.position;
  }

  totalCount(): number {
    return this.melody.length();
  }

  upcoming(count: number): Pitch[] {
    return this.melody.slice(this.position, count).map((note) => note.pitch);
  }
}
