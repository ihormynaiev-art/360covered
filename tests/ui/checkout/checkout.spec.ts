import { test, expect } from '@playwright/test';

test.describe('Example Navigation Tests @ui @smoke', () => {
    test('should load Google homepage', async ({ page }) => {
        await page.goto('https://www.google.com/');

        await expect(page).toHaveTitle(/Google/);
    });
});
