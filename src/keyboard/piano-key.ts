import type { Pitch } from '../music/pitch';
import type { Synth } from '../audio/synth';
import type { Voice } from '../audio/voice';

const LIT_CLASS = 'is-lit';

/** One key on screen: knows its pitch and how to light up. */
export class PianoKey {
  private readonly pitch: Pitch;
  private readonly element: HTMLButtonElement;

  constructor(pitch: Pitch, element: HTMLButtonElement) {
    this.pitch = pitch;
    this.element = element;
  }

  static create(pitch: Pitch, whiteKeysBefore: number): PianoKey {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = pitch.isSharp() ? 'piano-key piano-key--black' : 'piano-key piano-key--white';
    element.setAttribute('aria-label', pitch.name());
    element.setAttribute('aria-pressed', 'false');
    element.style.setProperty('--white-keys-before', String(whiteKeysBefore));
    return new PianoKey(pitch, element);
  }

  mountInto(container: HTMLElement): void {
    container.append(this.element);
  }

  owns(element: Element | null): boolean {
    return element === this.element;
  }

  isWhite(): boolean {
    return !this.pitch.isSharp();
  }

  sound(synth: Synth): Voice {
    return synth.start(this.pitch);
  }

  light(): void {
    this.element.classList.add(LIT_CLASS);
    this.element.setAttribute('aria-pressed', 'true');
  }

  darken(): void {
    this.element.classList.remove(LIT_CLASS);
    this.element.setAttribute('aria-pressed', 'false');
  }
}
