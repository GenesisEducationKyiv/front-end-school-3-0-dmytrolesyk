import { test, expect } from '../fixtures/with-backend.fixture';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/tracks');

  await expect(page).toHaveTitle('Music Manager');

  const heading = await page.getByTestId('tracks-header').textContent();

  expect(heading).toBe('Music Management App');
});
