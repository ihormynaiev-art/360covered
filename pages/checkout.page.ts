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

    /**
     * Fills the customer information form with the provided data.
     */
    async fillCustomerInformation(data: {
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        streetAddress: string,
        city: string,
        state: string,
        zipCode: string
    }): Promise<void> {
        await this.page.getByLabel('First Name').fill(data.firstName);
        await this.page.getByLabel('Last Name').fill(data.lastName);
        await this.page.getByLabel('Email').fill(data.email);
        await this.page.getByLabel('Phone').fill(data.phone);
        await this.page.getByLabel('Street Address').fill(data.streetAddress);
        await this.page.getByLabel('City').fill(data.city);
        await this.page.getByLabel('State').fill(data.state);
        await this.page.getByLabel('ZIP Code').fill(data.zipCode);
    }

    /**
     * Clicks the "Complete Purchase" button.
     */
    async completePurchase(): Promise<void> {
        const completeButton = this.page.getByRole('button', { name: 'Complete Purchase' });
        await completeButton.waitFor({ state: 'visible', timeout: 30000 });
        await completeButton.click();
        
        // Wait for final navigation or success state
        await this.page.waitForLoadState('networkidle');
    }
}
