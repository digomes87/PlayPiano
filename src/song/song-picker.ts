import { messages } from '../i18n/catalog';
import type { Song } from './song';

/** Row of buttons, one per song; the current song is marked as pressed. */
export class SongPicker {
  private readonly buttons: Map<Song, HTMLButtonElement>;

  private constructor(buttons: Map<Song, HTMLButtonElement>) {
    this.buttons = buttons;
  }

  static mount(container: HTMLElement, songs: readonly Song[], onPick: (song: Song) => void): SongPicker {
    const nav = document.createElement('nav');
    nav.className = 'song-picker';
    nav.setAttribute('aria-label', messages.songPicker);
    const buttons = new Map(songs.map((song) => [song, SongPicker.button(song, onPick)]));
    nav.append(...buttons.values());
    container.append(nav);
    return new SongPicker(buttons);
  }

  private static button(song: Song, onPick: (song: Song) => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'song-picker__song';
    button.textContent = messages.songTitles[song.id];
    button.addEventListener('click', () => onPick(song));
    return button;
  }

  select(current: Song): void {
    this.buttons.forEach((button, song) => button.setAttribute('aria-pressed', String(song === current)));
  }
}
