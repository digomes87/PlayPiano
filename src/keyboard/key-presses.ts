import type { Synth } from '../audio/synth';
import type { Voice } from '../audio/voice';
import type { PianoKey } from './piano-key';
import { FREE_PLAY, type PressJudge } from './press-judge';

interface Press {
  readonly key: PianoKey;
  readonly voice: Voice;
}

/** Keys currently held down, one per finger (pointer id). */
export class KeyPresses {
  private readonly pressesByPointer = new Map<number, Press>();

  private readonly synth: Synth;
  private judge: PressJudge = FREE_PLAY;

  constructor(synth: Synth) {
    this.synth = synth;
  }

  judgeWith(judge: PressJudge): void {
    this.judge = judge;
  }

  begin(pointerId: number, key: PianoKey): void {
    this.end(pointerId);
    key.light();
    this.pressesByPointer.set(pointerId, { key, voice: key.sound(this.synth) });
    key.submitTo(this.judge);
  }

  slideTo(pointerId: number, key: PianoKey): void {
    const press = this.pressesByPointer.get(pointerId);
    if (!press || press.key === key) {
      return;
    }
    this.begin(pointerId, key);
  }

  end(pointerId: number): void {
    const press = this.pressesByPointer.get(pointerId);
    if (!press) {
      return;
    }
    press.key.darken();
    press.voice.stop();
    this.pressesByPointer.delete(pointerId);
  }
}
