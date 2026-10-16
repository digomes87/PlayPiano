# PlayPiano

*[Português](README.pt-BR.md)*

Learn basic piano on an iPad. The large screen holds a two-and-a-half octave keyboard; the key to press next glows blue, the one you press lights up amber, and a wrong one lights red. Each correct note fills the key for the note's length, and the next light only shows up when that note is over, so following the lights keeps the rhythm.

The first song is **Butter-Fly**, the Digimon Adventure opening.

**Play:** https://digomes87.github.io/PlayPiano/

Best in Safari on an iPad in landscape. It also works with a mouse on a computer.

## How it works

- **Keyboard:** C4 to E6, multi-touch (chords work), slide a finger across the keys to play a glissando.
- **Guided practice:** blue light on the next key; amber when correct, red when wrong. A blue meter rises inside the key for the length of the note. A repeated note turns the light off and on again on the same key.
- **Listen:** plays the melody in time, lighting each key, so you hear the rhythm before trying it.
- **Upcoming notes:** the next six notes in solfège (Dó, Ré, Mi...), with a progress bar and a restart button.

## Songs

| Song | Section | Notes |
|------|---------|-------|
| Butter-Fly (Digimon Adventure) | Verse | 60 notes, G#4 to B5, 82 bpm |
| Butter-Fly (Digimon Adventure) | Chorus, first half | 33 notes, E5 to D6, 82 bpm |
| Ode to Joy (Beethoven) | Main theme | 30 notes, C4 to G4, 100 bpm |

The Butter-Fly melody is the top voice of the right hand of a free [letter-note arrangement](https://pianoletternotes.blogspot.com/2021/12/butterfly-digimon-opening.html). The second half of the chorus mixes melody and guitar riffs in that arrangement and is not included yet.

## Running it

Requires Node 22+.

```bash
npm install
npm run dev        # http://localhost:5173/PlayPiano/
npm test           # domain and audio tests (Vitest)
npm run test:e2e   # plays the app on an emulated iPad (Playwright + WebKit; first run: npx playwright install webkit)
npm run typecheck  # tsc
npm run build      # typecheck + production build in dist/
npm run preview    # serve the build
```

To try it on a real iPad before publishing, run `npm run dev -- --host` and open the address it prints on the iPad, on the same Wi-Fi.

## Branches and publishing

Git flow: `feature/*` → pull request to `develop` → CI → automatic promotion to `main` → GitHub Pages.

- `.github/workflows/ci.yml` runs `scripts/ci.sh` (install, unit tests, build, end-to-end tests) on every push and pull request to `develop` and `main`.
- `.github/workflows/promote.yml` runs when CI passes on a push to `develop`: it merges the tested commit into `main` (fast-forward when possible) and calls the deploy.
- `.github/workflows/deploy.yml` builds and publishes to GitHub Pages. It also runs on a manual push to `main`.

`develop` only accepts pull requests with green CI; `main` requires green CI and rejects force pushes.

## Architecture

```
src/
  music/      Pitch (MIDI number, name, frequency), PitchRange, Tempo. No DOM.
  song/       Melody (score parser), Lesson (immutable progress), Song, Practice,
              the song library, and the song mode UI: panel, picker, timed key cues.
  keyboard/   Keyboard view, keys, multi-touch presses, the press judge interface.
  audio/      Web Audio synthesizer and voices; unlocks audio on iPad gestures.
  i18n/       User-facing text (pt-BR), song titles and note names.
  styles/     Design tokens and global styles.
e2e/          Playwright tests on an emulated iPad.
```

The keyboard knows nothing about songs: it reports each press to a `PressJudge` and shows guide and hold lights when told to. The song mode is the judge.

### iPad audio

iPad Safari only lets audio start inside an activation gesture (finger lifted, click, key press); touching down is not one. The synthesizer resumes the audio context on every such gesture and before each note, so audio also comes back after the system suspends it. If the iPad is in silent mode, Safari stays silent.

## Adding a song

1. Write the melody as a score in `src/song/library.ts`: one `pitch:beats` token per note, for example `E4:1 F#4:0.5 G4:2`. `|` and line breaks are only for readability.
2. Add the song to `SONGS` with an id and a `Tempo` in beats per minute.
3. Add the id to `SongId` (`src/song/song.ts`) and its title to `songTitles` in `src/i18n/catalog.ts`.
4. Run `npm test`. A test checks that every note fits on the keyboard.

## Stack

Vite, TypeScript, Web Audio, Vitest and Playwright. No framework, no backend, no analytics.
