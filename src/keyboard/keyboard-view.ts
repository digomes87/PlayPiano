import { Synth } from '../audio/synth';
import { messages } from '../i18n/catalog';
import type { Pitch } from '../music/pitch';
import type { PitchRange } from '../music/pitch-range';
import { KeyPresses } from './key-presses';
import { PianoKeys } from './piano-keys';
import type { PressJudge } from './press-judge';
import './keyboard.css';

// Real pointers have non-negative ids, so demonstrations never collide with a finger.
const DEMONSTRATION_POINTER = -1;

/** Renders the keyboard and turns touches (or mouse) into lit, sounding keys. */
export class KeyboardView {
  private readonly keys: PianoKeys;
  private readonly presses: KeyPresses;

  private constructor(keys: PianoKeys, presses: KeyPresses) {
    this.keys = keys;
    this.presses = presses;
  }

  static mount(container: HTMLElement, range: PitchRange): KeyboardView {
    const view = new KeyboardView(PianoKeys.forRange(range), new KeyPresses(new Synth()));
    view.render(container);
    return view;
  }

  /** Every press is reported to the judge; a wrong press lights the key red. */
  judgeWith(judge: PressJudge): void {
    this.presses.judgeWith(judge);
  }

  /** Lights the guide LED on the key the learner should press next. */
  guideTo(pitch: Pitch | undefined): void {
    this.keys.guideTo(pitch);
  }

  /** Holds a key down on the learner's behalf, as in a demonstration. */
  playNote(pitch: Pitch): void {
    const key = this.keys.forPitch(pitch);
    if (!key) {
      return;
    }
    this.presses.begin(DEMONSTRATION_POINTER, key);
  }

  stopNote(): void {
    this.presses.end(DEMONSTRATION_POINTER);
  }

  showHold(pitch: Pitch, milliseconds: number): void {
    this.keys.clearHolds();
    this.keys.forPitch(pitch)?.showHold(milliseconds);
  }

  clearHold(): void {
    this.keys.clearHolds();
  }

  private render(container: HTMLElement): void {
    const keyboard = document.createElement('div');
    keyboard.className = 'keyboard';
    keyboard.setAttribute('role', 'group');
    keyboard.setAttribute('aria-label', messages.keyboardLabel);
    keyboard.style.setProperty('--white-key-count', String(this.keys.whiteCount()));
    this.keys.mountInto(keyboard);
    this.listen(keyboard);
    container.append(keyboard);
  }

  private listen(keyboard: HTMLElement): void {
    keyboard.addEventListener('pointerdown', (event) => this.onPointerDown(event));
    keyboard.addEventListener('pointerover', (event) => this.onPointerOver(event));
    keyboard.addEventListener('pointerup', (event) => this.presses.end(event.pointerId));
    keyboard.addEventListener('pointercancel', (event) => this.presses.end(event.pointerId));
    keyboard.addEventListener('pointerleave', (event) => this.presses.end(event.pointerId));
    keyboard.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  private onPointerDown(event: PointerEvent): void {
    const key = this.keys.ownerOf(event.target as Element);
    if (!key) {
      return;
    }
    event.preventDefault();
    this.releaseCapture(event);
    this.presses.begin(event.pointerId, key);
  }

  // Touch pointers are captured by the first element touched; releasing lets a finger slide across keys.
  private releaseCapture(event: PointerEvent): void {
    const target = event.target as Element;
    if (!target.hasPointerCapture(event.pointerId)) {
      return;
    }
    target.releasePointerCapture(event.pointerId);
  }

  private onPointerOver(event: PointerEvent): void {
    const key = this.keys.ownerOf(event.target as Element);
    if (!key) {
      return;
    }
    this.presses.slideTo(event.pointerId, key);
  }
}
