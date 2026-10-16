import { Lesson } from './lesson';
import type { Melody } from './melody';

export type SongId = 'butterFly' | 'odeToJoy';

/** A song the learner can practise. Its display title lives in the i18n catalog. */
export class Song {
  readonly id: SongId;
  private readonly melody: Melody;

  constructor(id: SongId, melody: Melody) {
    this.id = id;
    this.melody = melody;
  }

  lesson(): Lesson {
    return Lesson.start(this.melody);
  }
}
