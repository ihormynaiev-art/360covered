import { test, expect } from 'fixtures/app.fixture';

test.describe('Checkout Flow @ui', () => {
    test('should display checkout page', async ({ page }) => {
        await page.goto('/checkout');

        await expect(page).toHaveURL(/.*checkout/);
        await expect(page.locator('h1')).toBeVisible();
    });

    test('should show order summary', async ({ page }) => {
        await page.goto('/checkout');

        const orderSummarySection = page.locator('.order-summary');
        await expect(orderSummarySection).toBeVisible();
    });

    test('should validate required fields before payment', async ({ page }) => {
        await page.goto('/checkout');

        const submitPaymentButton = page.locator('button.submit-payment');
        await submitPaymentButton.click();

        const validationErrorMessage = page.locator('.validation-error');
        await expect(validationErrorMessage).toBeVisible();
    });
});
