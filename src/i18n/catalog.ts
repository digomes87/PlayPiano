import type { PitchClass } from '../music/pitch';
import type { SongId } from '../song/song';

const songTitles: Record<SongId, string> = {
  butterFlyVerse: 'Butter-Fly · Estrofe',
  butterFlyChorus: 'Butter-Fly · Refrão',
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
  listen: 'Ouvir',
  stopListening: 'Parar',
  songPicker: 'Escolha a música',
  songTitles,
  noteNames,
} as const;
