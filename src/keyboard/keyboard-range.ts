import { Pitch } from '../music/pitch';
import { PitchRange } from '../music/pitch-range';

/** C4 to E6: covers every song in the library and still fits an iPad in landscape. */
export const KEYBOARD_RANGE = new PitchRange(Pitch.parse('C4'), Pitch.parse('E6'));
