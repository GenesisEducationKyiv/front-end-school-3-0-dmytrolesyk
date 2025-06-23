import { test, expect } from '../fixtures/with-backend.fixture';

test('has title', async ({ page }) => {
  // const backendPort = backendContainer?.getMappedPort(8000);
  // await page.route('**/api/**', async route => {
  //   const url = route.request().url();
  //   const newUrl = url.replace('http://localhost:8000', `http://localhost:${backendPort}`);
  //   await route.continue({ url: newUrl });
  // });
  await page.goto('http://localhost:3000/tracks');

  await expect(page).toHaveTitle('Music Manager');

  const heading = await page.getByTestId('tracks-header').textContent();

  expect(heading).toBe('Music Management App');
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
