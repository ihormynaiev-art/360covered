import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://dev.get360covered.com/');
  await page.getByRole('textbox', { name: 'VIN' }).click();

  await page.getByRole('textbox', { name: 'VIN' }).fill('3GNAXHEV2JL379307');
  await page.getByRole('textbox', { name: 'Mileage' }).click();
  await page.getByRole('textbox', { name: 'Mileage' }).fill('40000');
  await page.getByRole('combobox').click();
});
