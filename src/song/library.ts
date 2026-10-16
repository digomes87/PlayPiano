import { Tempo } from '../music/tempo';
import { Melody } from './melody';
import { Song } from './song';

// Digimon Adventure opening (Wada Kouji). Top voice of the right hand from the
// letter-note arrangement at pianoletternotes.blogspot.com/2021/12/butterfly-digimon-opening.html
// Verse: blocks 1-8 of the arrangement.
// The arrangement uses about 5.5 dashes per second and the score counts 4 dashes per beat.
const BUTTER_FLY_TEMPO = new Tempo(82);
const BUTTER_FLY_VERSE = `
  E5:1.5 F#5:1.5 G#5:1 F#5:1 G#5:0.5 F#5:1
  E5:0.5 D#5:1 E5:3 C#5:0.5 E5:0.5 G#5:0.5 F#5:1
  E5:0.5 E5:0.5 E5:0.5 F#5:1 E5:1.5 E5:1 D#5:0.5 C#5:0.5
  B4:1 G#4:0.5 B4:0.5 C#5:2 C#5:0.5 E5:0.5 C#5:0.5 E5:0.5 C#5:0.5
  E5:0.5 C#5:0.5 E5:0.5 G#5:1 G#5:0.5 F#5:1 E5:0.5 F#5:1.5 E5:1.5
  F#5:1.5 G#5:1 F#5:1 F#5:0.5 F#5:1 E5:0.5
  D#5:0.5 E5:3.5 C#5:0.5 E5:0.5 G#5:0.5 F#5:1
  F#5:0.5 B5:0.5 E5:0.5 D#5:0.5 E5:2 E5:1 D#5:0.5 C#5:0.5 B4:2
`;

// Chorus, first half: pickup at the end of block 20, blocks 21-24, and block 25 up to the high A.
// The second half mixes melody with guitar riffs in the arrangement and is left out until verified.
const BUTTER_FLY_CHORUS = `
  E5:1.5 G#5:0.25 A5:0.25
  G#5:0.75 F#5:0.75 E5:0.5 F#5:1.5 A5:2.5 G#5:1.5
  G#5:0.25 A5:0.25 G#5:0.75 F#5:0.75 E5:0.5 F#5:1.5 E5:2.5
  G#5:1.5 G#5:0.25 A5:0.25 G#5:0.75 F#5:0.75 E5:0.5 F#5:1.5
  A5:2.5 G#5:1.5 G#5:0.25 A5:0.25 G#5:0.75 F#5:0.75 E5:0.5
  D6:1.5 C#6:1.5 A5:2
`;

// Beethoven, Symphony No. 9 - main theme (public domain).
const ODE_TO_JOY = `
  E4:1 E4:1 F4:1 G4:1 | G4:1 F4:1 E4:1 D4:1 | C4:1 C4:1 D4:1 E4:1 | E4:1.5 D4:0.5 D4:2
  E4:1 E4:1 F4:1 G4:1 | G4:1 F4:1 E4:1 D4:1 | C4:1 C4:1 D4:1 E4:1 | D4:1.5 C4:0.5 C4:2
`;

export const SONGS: readonly Song[] = [
  new Song('butterFlyVerse', BUTTER_FLY_TEMPO, Melody.parse(BUTTER_FLY_VERSE)),
  new Song('butterFlyChorus', BUTTER_FLY_TEMPO, Melody.parse(BUTTER_FLY_CHORUS)),
  new Song('odeToJoy', new Tempo(100), Melody.parse(ODE_TO_JOY)),
];
