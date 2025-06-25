import { test, expect } from '../fixtures/with-backend.fixture';

test('has title and header', async ({ page }) => {
  await page.goto('/tracks');
  await expect(page).toHaveTitle('Music Manager');

  const header = await page.getByTestId('tracks-header').textContent();
  expect(header).toBe('Music Management App');
});

test('setting number of items in URL works correctly', async ({ page }) => {
  await page.goto('/tracks?page=1&size=10');
  await expect(page.getByTestId(/^track-item-\d+$/)).toHaveCount(10);

  await page.goto('/tracks?page=1&size=20');
  await expect(page.getByTestId(/^track-item-\d+$/)).toHaveCount(20);

  await page.goto('/tracks?page=1&size=50');
  await expect(page.getByTestId(/^track-item-\d+$/)).toHaveCount(50);
});

test('search works correctly', async ({ page }) => {
  await page.goto('/tracks');
  await page.getByTestId('search-input').click();
  await page.getByTestId('search-input').fill('rolling');
  await expect(page.getByTestId(/^track-item-\d+-title$/)).toHaveCount(1);
  const trackTitle = await page.getByTestId(/^track-item-\d+-title$/).textContent();
  expect(trackTitle).toBe('Like a Rolling Stone');
});

test('add track functionality works correctly', async ({ page }) => {
  await page.goto('/tracks');
  await page.getByTestId('create-track-button').click();
  await expect(page.getByRole('dialog')).toBeVisible();

  await page.getByTestId('input-title').fill('Custer');
  await page.getByTestId('input-artist').click();
  await page.getByTestId('input-artist').fill('Slipknot');
  await page.getByTestId('input-album').click();
  await page.getByTestId('input-album').fill('The gray chapter');
  await page.getByTestId('input-album').click();
  await page.getByTestId('input-cover-image').click();
  await page
    .locator('[data-testid="input-cover-image"]')
    .fill('https://upload.wikimedia.org/wikipedia/en/3/36/5_The_Gray_Chapter_Artwork.jpg');
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Metal' }).click();
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Rock' }).click();
  await page.locator('[data-testid="submit-button"]').click();

  const track = page.locator('tr[data-testid^=track-item-]', {
    hasText: 'Custer',
  });

  await expect(track).toBeVisible();
});

test('edit functionality works correctly', async ({ page }) => {
  await page.goto('/tracks');
  await page
    .getByTestId(/edit-track-/)
    .first()
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();

  await page.getByTestId('input-title').fill('Edited title');
  await page.getByTestId('input-artist').click();
  await page.getByTestId('input-artist').fill('Edited artist');
  await page.getByTestId('input-album').click();
  await page.getByTestId('input-album').fill('Edited album');
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Jazz' }).click();
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Folk' }).click();
  await page.getByTestId('submit-button').click();

  const track = page.locator('tr[data-testid^=track-item-]', {
    hasText: 'Edited title',
  });

  await expect(track).toBeVisible();

  await expect(track.getByTestId(/^track-item-\d+-title$/)).toHaveText('Edited title');
  await expect(track.getByTestId(/^track-item-\d+-artist$/)).toHaveText('Edited artist');
  await expect(track.getByTestId(/^track-item-\d+-album$/)).toHaveText('Edited album');
});

test('delete functionality works correctly', async ({ page }) => {
  await page.goto('/tracks');

  const track = page.getByTestId(/^track-item-\d+$/).first();
  const trackTestId = await track.getAttribute('data-testid');

  // track Locator.prototype.getAttribute can return null
  expect(trackTestId).toBeTruthy();

  await track.getByTestId(/delete-track-/).click();
  await expect(page.getByRole('alertdialog')).toBeVisible();
  await page.getByTestId('confirm-delete').click();
  await expect(page.getByRole('alertdialog')).not.toBeVisible();

  await expect(page.getByTestId(trackTestId as string)).toHaveCount(0);
  await page.reload();
  // check if delition persists
  await expect(page.getByTestId(trackTestId as string)).toHaveCount(0);
});
