import { messages } from './i18n/catalog';
import { KeyboardView } from './keyboard/keyboard-view';
import { Pitch } from './music/pitch';
import { PitchRange } from './music/pitch-range';
import './styles/global.css';

const KEYBOARD_RANGE = new PitchRange(Pitch.parse('C4'), Pitch.parse('C6'));

const root = document.querySelector<HTMLElement>('#app');

if (root) {
  const brand = document.createElement('h1');
  brand.className = 'brand';
  brand.textContent = messages.appTitle;
  root.append(brand);
  KeyboardView.mount(root, KEYBOARD_RANGE);
}
