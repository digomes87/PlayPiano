import { test, expect, type Locator, type Page } from '@playwright/test';
import { messages } from '../src/i18n/catalog';
import { SONGS } from '../src/song/library';

const firstSong = SONGS[0];
const firstNote = firstSong.lesson().expectedPitch()!.name();
const secondSong = SONGS[1];

const pianoKey = (page: Page, noteName: string): Locator =>
  page.getByRole('button', { name: noteName, exact: true });

const progress = (page: Page): Locator => page.getByRole('progressbar');

const holdKey = async (page: Page, noteName: string): Promise<void> => {
  const box = await pianoKey(page, noteName).boundingBox();
  if (!box) {
    throw new Error(`Key ${noteName} is not rendered`);
  }
  await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.85);
  await page.mouse.down();
};

const tapKey = async (page: Page, noteName: string): Promise<void> => {
  await holdKey(page, noteName);
  await page.mouse.up();
};

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('shows the song and guides the first note', async ({ page }) => {
  await expect(page.getByRole('heading', { name: messages.songTitles[firstSong.id] })).toBeVisible();
  await expect(pianoKey(page, firstNote)).toHaveClass(/is-guide/);
  await expect(progress(page)).toHaveAttribute('value', '0');
});

test('Butter-Fly is the first song', () => {
  expect(firstSong.id).toBe('butterFly');
});

test('the correct key advances the guide to the next note', async ({ page }) => {
  const [first, second] = firstSong.lesson().upcoming(2).map((pitch) => pitch.name());

  await tapKey(page, first);

  await expect(progress(page)).toHaveAttribute('value', '1');
  await expect(pianoKey(page, second)).toHaveClass(/is-guide/);
  await expect(pianoKey(page, first)).not.toHaveClass(/is-guide/);
});

test('picking another song switches title, guide and progress', async ({ page }) => {
  await tapKey(page, firstNote);

  await page.getByRole('button', { name: messages.songTitles[secondSong.id] }).click();

  await expect(page.getByRole('heading', { name: messages.songTitles[secondSong.id] })).toBeVisible();
  await expect(progress(page)).toHaveAttribute('value', '0');
  await expect(pianoKey(page, secondSong.lesson().expectedPitch()!.name())).toHaveClass(/is-guide/);
});

test('a wrong key lights red and does not advance', async ({ page }) => {
  await holdKey(page, 'C4');
  await expect(pianoKey(page, 'C4')).toHaveClass(/is-wrong/);
  await expect(progress(page)).toHaveAttribute('value', '0');

  await page.mouse.up();
  await expect(pianoKey(page, 'C4')).not.toHaveClass(/is-wrong/);
});

test('finishing the song congratulates and restart begins again', async ({ page }) => {
  for (const pitch of firstSong.lesson().upcoming(Infinity)) {
    await tapKey(page, pitch.name());
  }
  await expect(page.getByRole('status')).toHaveText(messages.songFinished);

  await page.getByRole('button', { name: messages.restart }).click();
  await expect(progress(page)).toHaveAttribute('value', '0');
  await expect(pianoKey(page, firstNote)).toHaveClass(/is-guide/);
});
