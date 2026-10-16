import { messages } from '../i18n/catalog';
import type { Lesson } from './lesson';
import type { Song } from './song';
import { SongPicker } from './song-picker';
import './song-panel.css';

const UPCOMING_NOTE_COUNT = 6;

export interface SongPanelActions {
  restart(): void;
  switchTo(song: Song): void;
  toggleListening(): void;
}

/** Song picker, title, progress, upcoming note names and the restart button. */
export class SongPanel {
  private readonly root: HTMLElement;
  private readonly picker: SongPicker;

  private constructor(root: HTMLElement, picker: SongPicker) {
    this.root = root;
    this.picker = picker;
  }

  static mount(container: HTMLElement, songs: readonly Song[], actions: SongPanelActions): SongPanel {
    const root = document.createElement('section');
    root.className = 'song-panel';
    root.setAttribute('aria-labelledby', 'song-title');
    root.innerHTML = `
      <div class="song-panel__picker"></div>
      <header class="song-panel__header">
        <h2 class="song-panel__title" id="song-title"></h2>
        <div class="song-panel__actions">
          <button type="button" class="song-panel__action song-panel__listen"></button>
          <button type="button" class="song-panel__action song-panel__restart"></button>
        </div>
      </header>
      <progress class="song-panel__progress"></progress>
      <ol class="song-panel__upcoming"></ol>
      <p class="song-panel__finished" role="status"></p>
    `;
    root.querySelector('.song-panel__progress')!.setAttribute('aria-label', messages.songProgress);
    root.querySelector('.song-panel__upcoming')!.setAttribute('aria-label', messages.upcomingNotes);
    const restart = root.querySelector<HTMLButtonElement>('.song-panel__restart')!;
    restart.textContent = messages.restart;
    restart.addEventListener('click', () => actions.restart());
    root.querySelector('.song-panel__listen')!.addEventListener('click', () => actions.toggleListening());
    const pickerSlot = root.querySelector<HTMLElement>('.song-panel__picker')!;
    const picker = SongPicker.mount(pickerSlot, songs, (song) => actions.switchTo(song));
    container.append(root);
    return new SongPanel(root, picker);
  }

  showSong(song: Song): void {
    this.root.querySelector('.song-panel__title')!.textContent = messages.songTitles[song.id];
    this.picker.select(song);
  }

  showListening(isListening: boolean): void {
    const listen = this.root.querySelector('.song-panel__listen')!;
    listen.textContent = isListening ? messages.stopListening : messages.listen;
    listen.setAttribute('aria-pressed', String(isListening));
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
