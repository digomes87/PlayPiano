import { test, expect, type Locator, type Page } from '@playwright/test';
import { messages } from '../src/i18n/catalog';
import { SONGS } from '../src/song/library';

const songById = (id: string) => SONGS.find((song) => song.id === id)!;
const butterFly = songById('butterFlyVerse');
const odeToJoy = songById('odeToJoy');

const pianoKey = (page: Page, noteName: string): Locator =>
  page.getByRole('button', { name: noteName, exact: true });

const tapKey = async (page: Page, noteName: string): Promise<void> => {
  const box = await pianoKey(page, noteName).boundingBox();
  if (!box) {
    throw new Error(`Key ${noteName} is not rendered`);
  }
  await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.85);
  await page.mouse.down();
  await page.mouse.up();
};

const guidedKeys = (page: Page): Locator => page.locator('.piano-key.is-guide');

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.goto('./');
});

test('after a correct note the next guide waits for the note length', async ({ page }) => {
  const lesson = butterFly.lesson();
  const [first, second] = lesson.upcoming(2).map((pitch) => pitch.name());
  const firstNoteLength = butterFly.durationOf(lesson.expectedBeats());

  await tapKey(page, first);

  await expect(pianoKey(page, first)).toHaveClass(/is-holding/);
  await expect(guidedKeys(page)).toHaveCount(0);

  await page.clock.runFor(firstNoteLength);

  await expect(pianoKey(page, second)).toHaveClass(/is-guide/);
  await expect(pianoKey(page, first)).not.toHaveClass(/is-holding/);
});

test('a repeated note turns the guide off and on again on the same key', async ({ page }) => {
  await page.getByRole('button', { name: messages.songTitles[odeToJoy.id] }).click();
  const lesson = odeToJoy.lesson();
  const repeated = lesson.expectedPitch()!.name();
  expect(lesson.upcoming(2).map((pitch) => pitch.name())).toEqual([repeated, repeated]);

  await tapKey(page, repeated);
  await expect(pianoKey(page, repeated)).not.toHaveClass(/is-guide/);

  await page.clock.runFor(odeToJoy.durationOf(lesson.expectedBeats()));
  await expect(pianoKey(page, repeated)).toHaveClass(/is-guide/);
});

test('listen plays the melody in time, lighting each key', async ({ page }) => {
  const lesson = butterFly.lesson();
  const [first, second] = lesson.upcoming(2).map((pitch) => pitch.name());

  await page.getByRole('button', { name: messages.listen }).click();

  await expect(pianoKey(page, first)).toHaveAttribute('aria-pressed', 'true');
  await expect(guidedKeys(page)).toHaveCount(0);

  await page.clock.runFor(butterFly.durationOf(lesson.expectedBeats()));

  await expect(pianoKey(page, second)).toHaveAttribute('aria-pressed', 'true');
  await expect(pianoKey(page, first)).toHaveAttribute('aria-pressed', 'false');
});

test('stop ends the playback and brings the guide back', async ({ page }) => {
  const first = butterFly.lesson().expectedPitch()!.name();

  await page.getByRole('button', { name: messages.listen }).click();
  await page.getByRole('button', { name: messages.stopListening }).click();

  await expect(page.locator('.piano-key.is-lit')).toHaveCount(0);
  await expect(pianoKey(page, first)).toHaveClass(/is-guide/);
});
