import type { KeyboardView } from '../keyboard/keyboard-view';
import type { PressJudge, PressVerdict } from '../keyboard/press-judge';
import type { Pitch } from '../music/pitch';
import type { Lesson } from './lesson';
import { SongPanel, type SongPanelActions } from './song-panel';
import type { Song } from './song';

/** Where a lesson is shown: guide light on the keyboard plus the song panel. */
class LessonStage {
  private readonly keyboard: KeyboardView;
  private readonly panel: SongPanel;

  constructor(keyboard: KeyboardView, panel: SongPanel) {
    this.keyboard = keyboard;
    this.panel = panel;
  }

  showSong(song: Song): void {
    this.panel.showSong(song);
  }

  show(lesson: Lesson): void {
    this.keyboard.guideTo(lesson.expectedPitch());
    this.panel.show(lesson);
  }
}

/** Guided play: lights the next note, advances on the right key, flags the wrong one. */
export class SongMode implements PressJudge, SongPanelActions {
  private readonly stage: LessonStage;
  private lesson: Lesson;

  private constructor(stage: LessonStage, lesson: Lesson) {
    this.stage = stage;
    this.lesson = lesson;
  }

  static start(container: HTMLElement, songs: readonly Song[], keyboard: KeyboardView): SongMode {
    let mode: SongMode | undefined;
    const actions: SongPanelActions = {
      restart: () => mode?.restart(),
      switchTo: (song) => mode?.switchTo(song),
    };
    const panel = SongPanel.mount(container, songs, actions);
    mode = new SongMode(new LessonStage(keyboard, panel), songs[0].lesson());
    keyboard.judgeWith(mode);
    mode.switchTo(songs[0]);
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

  switchTo(song: Song): void {
    this.stage.showSong(song);
    this.moveTo(song.lesson());
  }

  private moveTo(lesson: Lesson): void {
    this.lesson = lesson;
    this.stage.show(lesson);
  }
}
