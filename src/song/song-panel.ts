import { messages } from '../i18n/catalog';
import type { Lesson } from './lesson';
import type { Song } from './song';
import './song-panel.css';

const UPCOMING_NOTE_COUNT = 6;

/** Song title, progress, upcoming note names and the restart button. */
export class SongPanel {
  private readonly root: HTMLElement;
  private readonly onRestart: () => void;

  private constructor(root: HTMLElement, onRestart: () => void) {
    this.root = root;
    this.onRestart = onRestart;
  }

  static mount(container: HTMLElement, song: Song, onRestart: () => void): SongPanel {
    const root = document.createElement('section');
    root.className = 'song-panel';
    root.setAttribute('aria-labelledby', 'song-title');
    root.innerHTML = `
      <header class="song-panel__header">
        <h2 class="song-panel__title" id="song-title"></h2>
        <button type="button" class="song-panel__restart"></button>
      </header>
      <progress class="song-panel__progress"></progress>
      <ol class="song-panel__upcoming"></ol>
      <p class="song-panel__finished" role="status"></p>
    `;
    root.querySelector('.song-panel__title')!.textContent = messages.songTitles[song.id];
    root.querySelector('.song-panel__progress')!.setAttribute('aria-label', messages.songProgress);
    root.querySelector('.song-panel__upcoming')!.setAttribute('aria-label', messages.upcomingNotes);
    const restart = root.querySelector<HTMLButtonElement>('.song-panel__restart')!;
    restart.textContent = messages.restart;
    container.append(root);
    const panel = new SongPanel(root, onRestart);
    restart.addEventListener('click', () => panel.onRestart());
    return panel;
  }

  show(lesson: Lesson): void {
    this.showProgress(lesson);
    this.showUpcoming(lesson);
    this.showFinished(lesson);
  }

  private showProgress(lesson: Lesson): void {
    const progress = this.root.querySelector<HTMLProgressElement>('.song-panel__progress')!;
    progress.max = lesson.totalCount();
    progress.value = lesson.playedCount();
    progress.setAttribute('value', String(lesson.playedCount()));
  }

  private showUpcoming(lesson: Lesson): void {
    const items = lesson.upcoming(UPCOMING_NOTE_COUNT).map((pitch) => {
      const item = document.createElement('li');
      item.className = 'song-panel__note';
      item.textContent = messages.noteNames[pitch.pitchClass()];
      return item;
    });
    this.root.querySelector('.song-panel__upcoming')!.replaceChildren(...items);
  }

  private showFinished(lesson: Lesson): void {
    const finished = this.root.querySelector('.song-panel__finished')!;
    finished.textContent = lesson.isFinished() ? messages.songFinished : '';
  }
}
