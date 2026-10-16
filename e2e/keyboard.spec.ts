import { test, expect, type Locator, type Page } from '@playwright/test';
import { messages } from '../src/i18n/catalog';

const pianoKey = (page: Page, noteName: string): Locator =>
  page.getByRole('button', { name: noteName, exact: true });

const centerOf = async (key: Locator) => {
  const box = await key.boundingBox();
  if (!box) {
    throw new Error('Key is not rendered');
  }
  return { x: box.x + box.width / 2, y: box.y + box.height * 0.85 };
};

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('renders two octaves from C4 to C6', async ({ page }) => {
  await expect(page.getByRole('group', { name: messages.keyboardLabel }).getByRole('button')).toHaveCount(25);
  await expect(pianoKey(page, 'C4')).toBeVisible();
  await expect(pianoKey(page, 'C6')).toBeVisible();
});

test('a key lights up while pressed and goes dark on release', async ({ page }) => {
  const key = pianoKey(page, 'E4');
  const point = await centerOf(key);

  await page.mouse.move(point.x, point.y);
  await page.mouse.down();
  await expect(key).toHaveAttribute('aria-pressed', 'true');

  await page.mouse.up();
  await expect(key).toHaveAttribute('aria-pressed', 'false');
});

test('sliding across keys moves the light along', async ({ page }) => {
  const from = pianoKey(page, 'C4');
  const to = pianoKey(page, 'D4');
  const start = await centerOf(from);
  const end = await centerOf(to);

  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 5 });

  await expect(to).toHaveAttribute('aria-pressed', 'true');
  await expect(from).toHaveAttribute('aria-pressed', 'false');
  await page.mouse.up();
});

test('black keys sit above and between white keys', async ({ page }) => {
  const black = await pianoKey(page, 'C#4').boundingBox();
  const leftWhite = await pianoKey(page, 'C4').boundingBox();
  const rightWhite = await pianoKey(page, 'D4').boundingBox();

  expect(black && leftWhite && rightWhite).toBeTruthy();
  expect(black!.x).toBeGreaterThan(leftWhite!.x);
  expect(black!.x + black!.width).toBeLessThan(rightWhite!.x + rightWhite!.width);
  expect(black!.height).toBeLessThan(leftWhite!.height);
});
