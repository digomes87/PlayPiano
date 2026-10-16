import { test, expect, type Locator, type Page } from '@playwright/test';
import { messages } from '../src/i18n/catalog';
import { SONGS } from '../src/song/library';

const firstSong = SONGS[0];

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
  await expect(pianoKey(page, 'E4')).toHaveClass(/is-guide/);
  await expect(progress(page)).toHaveAttribute('value', '0');
});

test('the correct key advances the guide to the next note', async ({ page }) => {
  await tapKey(page, 'E4');
  await expect(progress(page)).toHaveAttribute('value', '1');
  await expect(pianoKey(page, 'E4')).toHaveClass(/is-guide/);

  await tapKey(page, 'E4');
  await expect(pianoKey(page, 'F4')).toHaveClass(/is-guide/);
  await expect(pianoKey(page, 'E4')).not.toHaveClass(/is-guide/);
});

test('a wrong key lights red and does not advance', async ({ page }) => {
  await holdKey(page, 'C5');
  await expect(pianoKey(page, 'C5')).toHaveClass(/is-wrong/);
  await expect(progress(page)).toHaveAttribute('value', '0');

  await page.mouse.up();
  await expect(pianoKey(page, 'C5')).not.toHaveClass(/is-wrong/);
});

test('finishing the song congratulates and restart begins again', async ({ page }) => {
  for (const pitch of firstSong.lesson().upcoming(Infinity)) {
    await tapKey(page, pitch.name());
  }
  await expect(page.getByRole('status')).toHaveText(messages.songFinished);

  await page.getByRole('button', { name: messages.restart }).click();
  await expect(progress(page)).toHaveAttribute('value', '0');
  await expect(pianoKey(page, 'E4')).toHaveClass(/is-guide/);
});
