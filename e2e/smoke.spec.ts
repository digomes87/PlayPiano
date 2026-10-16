import { test, expect } from '@playwright/test';
import { messages } from '../src/i18n/catalog';

test('app loads', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: messages.appTitle })).toBeVisible();
});
