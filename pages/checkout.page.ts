import { Page, Locator } from '@playwright/test';
import { BasePage } from 'pages/base.page';

export class CheckoutPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Clicks the "Continue to Checkout" button.
     */
    async continueToCheckout(): Promise<void> {
        const continueButton = this.page.getByRole('button', { name: 'Continue to Checkout' });
        await continueButton.waitFor({ state: 'visible', timeout: 30000 });
        await continueButton.click();
        
        // Wait for potential navigation
        await this.page.waitForLoadState('networkidle');
    }
}
