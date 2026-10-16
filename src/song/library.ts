import { Melody } from './melody';
import { Song } from './song';

// Beethoven, Symphony No. 9 - main theme (public domain).
const ODE_TO_JOY = `
  E4:1 E4:1 F4:1 G4:1 | G4:1 F4:1 E4:1 D4:1 | C4:1 C4:1 D4:1 E4:1 | E4:1.5 D4:0.5 D4:2
  E4:1 E4:1 F4:1 G4:1 | G4:1 F4:1 E4:1 D4:1 | C4:1 C4:1 D4:1 E4:1 | D4:1.5 C4:0.5 C4:2
`;

export const SONGS: readonly Song[] = [new Song('odeToJoy', Melody.parse(ODE_TO_JOY))];
