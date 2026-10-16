import { Pitch } from '../music/pitch';
import { PitchRange } from '../music/pitch-range';

/** Two octaves plus the top C: fits an iPad in landscape with comfortable key widths. */
export const KEYBOARD_RANGE = new PitchRange(Pitch.parse('C4'), Pitch.parse('C6'));
