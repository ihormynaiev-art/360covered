import { test, expect } from '@playwright/test';

test.describe('Example UI Tests @ui', () => {
    test('should open Playwright documentation page', async ({ page }) => {
        await page.goto('https://playwright.dev/');

        await expect(page).toHaveTitle(/Playwright/);
    });

    test('should navigate to docs section', async ({ page }) => {
        await page.goto('https://playwright.dev/');

        await page.getByRole('link', { name: 'Get started' }).click();

        await expect(page).toHaveURL(/.*intro/);
    });
});
