import type { KeyboardView } from '../keyboard/keyboard-view';
import type { Pitch } from '../music/pitch';
import type { SongNote } from './melody';
import type { Song } from './song';

// Short silence before the next note so repeated notes are heard as separate presses.
const NOTE_GAP_RATIO = 0.9;

type TimelineKind = 'guide' | 'melody';

interface Timeline {
  readonly timer: ReturnType<typeof setTimeout>;
  readonly kind: TimelineKind;
}

/** Timed light effects on the keyboard. Only one timeline runs at a time. */
export class KeyboardCues {
  private readonly keyboard: KeyboardView;
  private timeline: Timeline | undefined;

  constructor(keyboard: KeyboardView) {
    this.keyboard = keyboard;
  }

  guideNow(pitch: Pitch | undefined): void {
    this.stop();
    this.keyboard.guideTo(pitch);
  }

  holdThenGuide(held: Pitch, milliseconds: number, next: Pitch | undefined): void {
    this.stop();
    this.keyboard.showHold(held, milliseconds);
    this.later('guide', milliseconds, () => this.guideNow(next));
  }

  playMelody(song: Song, notes: SongNote[], onEnd: () => void): void {
    this.stop();
    this.playFrom(song, notes, onEnd);
  }

  isPlayingMelody(): boolean {
    return this.timeline?.kind === 'melody';
  }

  stop(): void {
    clearTimeout(this.timeline?.timer);
    this.timeline = undefined;
    this.keyboard.stopNote();
    this.keyboard.clearHold();
    this.keyboard.guideTo(undefined);
  }

  private playFrom(song: Song, notes: SongNote[], onEnd: () => void): void {
    const [note, ...rest] = notes;
    if (!note) {
      this.stop();
      onEnd();
      return;
    }
    const length = song.durationOf(note.beats);
    // Schedule first: the demonstration press is judged, and the judge must see a melody playing.
    this.later('melody', length * NOTE_GAP_RATIO, () => {
      this.keyboard.stopNote();
      this.later('melody', length * (1 - NOTE_GAP_RATIO), () => this.playFrom(song, rest, onEnd));
    });
    this.keyboard.playNote(note.pitch);
  }

  private later(kind: TimelineKind, milliseconds: number, action: () => void): void {
    const timer = setTimeout(() => {
      this.timeline = undefined;
      action();
    }, milliseconds);
    this.timeline = { timer, kind };
  }
}
