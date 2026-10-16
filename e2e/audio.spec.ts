import { test, expect, type Page } from '@playwright/test';
import { messages } from '../src/i18n/catalog';

declare global {
  interface Window {
    audioContexts: AudioContext[];
    startedOscillators: number;
  }
}

const tapKey = async (page: Page, noteName: string): Promise<void> => {
  const box = await page.getByRole('button', { name: noteName, exact: true }).boundingBox();
  if (!box) {
    throw new Error(`Key ${noteName} is not rendered`);
  }
  await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.85);
  await page.mouse.down();
  await page.mouse.up();
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.audioContexts = [];
    window.startedOscillators = 0;
    const NativeAudioContext = window.AudioContext;
    window.AudioContext = class extends NativeAudioContext {
      constructor(options?: AudioContextOptions) {
        super(options);
        window.audioContexts.push(this);
      }
    };
    const nativeStart = OscillatorNode.prototype.start;
    OscillatorNode.prototype.start = function (when?: number) {
      window.startedOscillators += 1;
      return nativeStart.call(this, when);
    };
  });
  await page.goto('./');
});

test('keys still sound after listening and restarting', async ({ page }) => {
  await page.getByRole('button', { name: messages.listen }).click();
  await page.getByRole('button', { name: messages.stopListening }).click();
  await page.getByRole('button', { name: messages.restart }).click();
  const before = await page.evaluate(() => window.startedOscillators);

  await tapKey(page, 'E5');

  await expect.poll(() => page.evaluate(() => window.startedOscillators)).toBeGreaterThan(before);
  await expect.poll(() => page.evaluate(() => window.audioContexts.map((context) => context.state))).toEqual([
    'running',
  ]);
});
