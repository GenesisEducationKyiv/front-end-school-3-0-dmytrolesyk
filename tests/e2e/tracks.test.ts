import { test, expect } from '../fixtures/with-backend.fixture';

test('Has title and header', async ({ page }) => {
  await page.goto('/tracks');

  await expect(page).toHaveTitle('Music Manager');

  const header = await page.getByTestId('tracks-header').textContent();

  expect(header).toBe('Music Management App');
});

test.only('Tracks are rendered correctly', async ({ page }) => {
  await page.goto('/tracks');

  await expect(page).toHaveTitle('Music Manager');

  const trackRows = page.getByTestId(/track-item-\d+/g);
  expect(await trackRows.count()).toBe(9);
});
