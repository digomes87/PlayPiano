import type { Pitch } from '../music/pitch';

export type PressVerdict = 'correct' | 'wrong' | 'free';

/** Decides whether a pressed pitch was the right one (e.g. the next note of a song). */
export interface PressJudge {
  judge(pitch: Pitch): PressVerdict;
}

export const FREE_PLAY: PressJudge = { judge: () => 'free' };
