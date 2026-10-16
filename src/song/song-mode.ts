import type { KeyboardView } from '../keyboard/keyboard-view';
import type { PressJudge, PressVerdict } from '../keyboard/press-judge';
import type { Pitch } from '../music/pitch';
import { KeyboardCues } from './keyboard-cues';
import { Practice } from './practice';
import { SongPanel, type SongPanelActions } from './song-panel';
import type { Song } from './song';

/** Where a practice is shown: timed lights on the keyboard plus the song panel. */
class PracticeStage {
  readonly cues: KeyboardCues;
  private readonly panel: SongPanel;

  constructor(cues: KeyboardCues, panel: SongPanel) {
    this.cues = cues;
    this.panel = panel;
  }

  show(practice: Practice): void {
    this.panel.showSong(practice.song);
    this.panel.show(practice.lesson);
    this.panel.showListening(false);
    this.cues.guideNow(practice.lesson.expectedPitch());
  }

  showAfterHold(practice: Practice, held: Pitch, holdMilliseconds: number): void {
    this.panel.show(practice.lesson);
    this.cues.holdThenGuide(held, holdMilliseconds, practice.lesson.expectedPitch());
  }

  listen(practice: Practice, onEnd: () => void): void {
    this.panel.showListening(true);
    this.cues.playMelody(practice.song, practice.song.lesson().remainingNotes(), onEnd);
  }
}

/**
 * Guided play. The next key glows blue; after a correct press the key fills for the
 * length of the note and the next guide appears only when that note is over, so
 * following the lights keeps the rhythm. Wrong keys light red.
 */
export class SongMode implements PressJudge, SongPanelActions {
  private readonly stage: PracticeStage;
  private practice: Practice;

  private constructor(stage: PracticeStage, practice: Practice) {
    this.stage = stage;
    this.practice = practice;
  }

  static start(container: HTMLElement, songs: readonly Song[], keyboard: KeyboardView): SongMode {
    let mode: SongMode | undefined;
    const actions: SongPanelActions = {
      restart: () => mode?.restart(),
      switchTo: (song) => mode?.switchTo(song),
      toggleListening: () => mode?.toggleListening(),
    };
    const panel = SongPanel.mount(container, songs, actions);
    mode = new SongMode(new PracticeStage(new KeyboardCues(keyboard), panel), Practice.of(songs[0]));
    keyboard.judgeWith(mode);
    mode.stage.show(mode.practice);
    return mode;
  }

  judge(pitch: Pitch): PressVerdict {
    if (this.stage.cues.isPlayingMelody() || this.practice.isFinished()) {
      return 'free';
    }
    if (!this.practice.accepts(pitch)) {
      return 'wrong';
    }
    const holdMilliseconds = this.practice.expectedNoteLength();
    this.practice = this.practice.advance();
    this.stage.showAfterHold(this.practice, pitch, holdMilliseconds);
    return 'correct';
  }

  restart(): void {
    this.showFresh(this.practice.restart());
  }

  switchTo(song: Song): void {
    this.showFresh(Practice.of(song));
  }

  toggleListening(): void {
    if (this.stage.cues.isPlayingMelody()) {
      this.restart();
      return;
    }
    this.stage.listen(this.practice, () => this.restart());
  }

  private showFresh(practice: Practice): void {
    this.practice = practice;
    this.stage.show(practice);
  }
}
