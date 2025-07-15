import { test, expect } from '@playwright/test';
import { TEST_IDS } from '../constants';

test('has title and header', async ({ page }) => {
  await page.goto('/tracks');
  await expect(page).toHaveTitle('Music Manager');

  const header = await page.getByTestId('tracks-header').textContent();
  expect(header).toBe('Music Management App');
});

test('setting number of items in URL works correctly', async ({ page }) => {
  await page.goto('/tracks?page=1&size=10');
  await expect(page.getByTestId(TEST_IDS.TRACK_ITEM)).toHaveCount(10);

  await page.goto('/tracks?page=1&size=20');
  await expect(page.getByTestId(TEST_IDS.TRACK_ITEM)).toHaveCount(20);

  await page.goto('/tracks?page=1&size=50');
  await expect(page.getByTestId(TEST_IDS.TRACK_ITEM)).toHaveCount(50);
});

test('search works correctly', async ({ page }) => {
  await page.goto('/tracks');
  await page.waitForTimeout(600); // search input is debounced
  await page.getByTestId(TEST_IDS.SEARCH_INPUT).click();
  await page.getByTestId(TEST_IDS.SEARCH_INPUT).fill('rolling');
  await expect(page.getByTestId(TEST_IDS.TRACK_TITLE)).toHaveCount(1);
  const trackTitle = await page.getByTestId(TEST_IDS.TRACK_TITLE).textContent();
  expect(trackTitle).toBe('Like a Rolling Stone');
});

test('add track functionality works correctly', async ({ page }) => {
  await page.goto('/tracks');
  await page.getByTestId(TEST_IDS.CREATE_TRACK_BUTTON).click();
  await expect(page.getByRole('dialog')).toBeVisible();

  await page.getByTestId(TEST_IDS.INPUT_TITLE).click();
  await page.getByTestId(TEST_IDS.INPUT_TITLE).fill('Custer');
  await page.getByTestId(TEST_IDS.INPUT_ARTIST).click();
  await page.getByTestId(TEST_IDS.INPUT_ARTIST).fill('Slipknot');
  await page.getByTestId(TEST_IDS.INPUT_ALBUM).click();
  await page.getByTestId(TEST_IDS.INPUT_ALBUM).fill('The gray chapter');
  await page.getByTestId(TEST_IDS.INPUT_COVER_IMAGE).click();
  await page
    .getByTestId(TEST_IDS.INPUT_COVER_IMAGE)
    .fill('https://upload.wikimedia.org/wikipedia/en/3/36/5_The_Gray_Chapter_Artwork.jpg');
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Metal' }).click();
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Rock' }).click();
  await page.getByTestId(TEST_IDS.SUBMIT_BUTTON).click();

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

  await page.getByTestId(TEST_IDS.INPUT_TITLE).click();
  await page.getByTestId(TEST_IDS.INPUT_TITLE).fill('Edited title');
  await page.getByTestId(TEST_IDS.INPUT_ARTIST).click();
  await page.getByTestId(TEST_IDS.INPUT_ARTIST).fill('Edited artist');
  await page.getByTestId(TEST_IDS.INPUT_ALBUM).click();
  await page.getByTestId(TEST_IDS.INPUT_ALBUM).fill('Edited album');
  await page.getByRole('combobox').click();
  await page.getByRole('option').first().click();
  await page.getByTestId(TEST_IDS.SUBMIT_BUTTON).click();

  const track = page.locator('tr[data-testid^=track-item-]', {
    hasText: 'Edited title',
  });

  await expect(track).toBeVisible();

  await expect(track.getByTestId(TEST_IDS.TRACK_TITLE)).toHaveText('Edited title');
  await expect(track.getByTestId(TEST_IDS.TRACK_ARTIST)).toHaveText('Edited artist');
  await expect(track.getByTestId(TEST_IDS.TRACK_ALBUM)).toHaveText('Edited album');
});

test('delete functionality works correctly', async ({ page }) => {
  await page.goto('/tracks');

  const track = page.getByTestId(TEST_IDS.TRACK_ITEM).first();
  const trackTestId = await track.getAttribute('data-testid');

  // track Locator.prototype.getAttribute can return null
  expect(trackTestId).toBeTruthy();

  await track.getByTestId(TEST_IDS.DELETE_TRACK).click();
  await expect(page.getByRole('alertdialog')).toBeVisible();
  await page.getByTestId(TEST_IDS.CONFIRM_DELETE).click();
  await expect(page.getByRole('alertdialog')).not.toBeVisible();

  await expect(page.getByTestId(trackTestId as string)).toHaveCount(0);
  await page.reload();
  // check if delition persists
  await expect(page.getByTestId(trackTestId as string)).toHaveCount(0);
});
