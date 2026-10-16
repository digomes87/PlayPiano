import type { KeyboardView } from '../keyboard/keyboard-view';
import type { PressJudge, PressVerdict } from '../keyboard/press-judge';
import type { Pitch } from '../music/pitch';
import type { Lesson } from './lesson';
import { SongPanel } from './song-panel';
import type { Song } from './song';

/** Where a lesson is shown: guide light on the keyboard plus the song panel. */
class LessonStage {
  private readonly keyboard: KeyboardView;
  private readonly panel: SongPanel;

  constructor(keyboard: KeyboardView, panel: SongPanel) {
    this.keyboard = keyboard;
    this.panel = panel;
  }

  show(lesson: Lesson): void {
    this.keyboard.guideTo(lesson.expectedPitch());
    this.panel.show(lesson);
  }
}

/** Guided play: lights the next note, advances on the right key, flags the wrong one. */
export class SongMode implements PressJudge {
  private readonly stage: LessonStage;
  private lesson: Lesson;

  private constructor(stage: LessonStage, lesson: Lesson) {
    this.stage = stage;
    this.lesson = lesson;
  }

  static start(container: HTMLElement, song: Song, keyboard: KeyboardView): SongMode {
    let mode: SongMode | undefined;
    const panel = SongPanel.mount(container, song, () => mode?.restart());
    mode = new SongMode(new LessonStage(keyboard, panel), song.lesson());
    keyboard.judgeWith(mode);
    mode.stage.show(mode.lesson);
    return mode;
  }

  judge(pitch: Pitch): PressVerdict {
    if (this.lesson.isFinished()) {
      return 'free';
    }
    if (!this.lesson.accepts(pitch)) {
      return 'wrong';
    }
    this.moveTo(this.lesson.advance());
    return 'correct';
  }

  restart(): void {
    this.moveTo(this.lesson.restart());
  }

  private moveTo(lesson: Lesson): void {
    this.lesson = lesson;
    this.stage.show(lesson);
  }
}
