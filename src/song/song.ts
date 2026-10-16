import type { Tempo } from '../music/tempo';
import { Lesson } from './lesson';
import type { Melody } from './melody';

export type SongId = 'butterFlyVerse' | 'butterFlyChorus' | 'odeToJoy';

/** A song the learner can practise. Its display title lives in the i18n catalog. */
export class Song {
  readonly id: SongId;
  private readonly tempo: Tempo;
  private readonly melody: Melody;

  constructor(id: SongId, tempo: Tempo, melody: Melody) {
    this.id = id;
    this.tempo = tempo;
    this.melody = melody;
  }

  lesson(): Lesson {
    return Lesson.start(this.melody);
  }

  durationOf(beats: number): number {
    return this.tempo.millisecondsFor(beats);
  }
}
