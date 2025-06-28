import { test, expect } from '@playwright/experimental-ct-react';
import { GenresInputStory } from '@/features/tracks/components/genres-input/genres-input.story';
import { TEST_IDS } from '../constants';

test('GenresTagInput component test', async ({ mount, page }) => {
  const component = await mount(<GenresInputStory />);

  await expect(component.getByRole('combobox')).toHaveText('Select genre to add');
  await expect(component.getByTestId(TEST_IDS.BADGE).getByText('Reggae')).not.toBeVisible();

  await component.getByRole('combobox').click();
  await expect(page.getByText('Reggae')).toBeVisible();
  await page.getByText('Reggae').click();

  await expect(component.getByTestId(TEST_IDS.BADGE).getByText('Reggae')).toBeVisible();
  await component.getByRole('button').getByText('Jazz').click();
  await expect(component.getByTestId(TEST_IDS.BADGE).getByText('Jazz')).not.toBeVisible();
});
