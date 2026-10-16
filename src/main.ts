import { messages } from './i18n/catalog';
import { KeyboardView } from './keyboard/keyboard-view';
import { KEYBOARD_RANGE } from './keyboard/keyboard-range';
import { SONGS } from './song/library';
import { SongMode } from './song/song-mode';
import './styles/global.css';

const root = document.querySelector<HTMLElement>('#app');

if (root) {
  const brand = document.createElement('h1');
  brand.className = 'brand';
  brand.textContent = messages.appTitle;
  root.append(brand);
  const songSlot = document.createElement('div');
  root.append(songSlot);
  const keyboard = KeyboardView.mount(root, KEYBOARD_RANGE);
  SongMode.start(songSlot, SONGS, keyboard);
}
