import type { PitchClass } from '../music/pitch';
import type { SongId } from '../song/song';

const songTitles: Record<SongId, string> = {
  odeToJoy: 'Ode à Alegria',
};

const noteNames: Record<PitchClass, string> = {
  C: 'Dó',
  'C#': 'Dó♯',
  D: 'Ré',
  'D#': 'Ré♯',
  E: 'Mi',
  F: 'Fá',
  'F#': 'Fá♯',
  G: 'Sol',
  'G#': 'Sol♯',
  A: 'Lá',
  'A#': 'Lá♯',
  B: 'Si',
};

export const messages = {
  appTitle: 'PlayPiano',
  keyboardLabel: 'Teclado de piano',
  songProgress: 'Progresso da música',
  upcomingNotes: 'Próximas notas',
  songFinished: 'Parabéns! Você tocou a música inteira.',
  restart: 'Recomeçar',
  songTitles,
  noteNames,
} as const;
