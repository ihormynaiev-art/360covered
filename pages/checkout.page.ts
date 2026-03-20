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
     * Fills the payment method section with card details.
     */
    async fill_payment_method_details(payment_method_details_input: {
        card_number_text: string,
        expiration_date_text: string,
        cvc_code_text: string,
        cardholder_name_text: string,
        country_or_region_text: string,
        billing_zip_code_text: string
    }): Promise<void> {
        // Note: Payment fields are often inside iframes. Using getByLabel as a starting point.
        await this.page.getByLabel('Card number').fill(payment_method_details_input.card_number_text);
        await this.page.getByLabel('Expiration date').fill(payment_method_details_input.expiration_date_text);
        await this.page.getByLabel('CVC').fill(payment_method_details_input.cvc_code_text);
        await this.page.getByLabel('Cardholder name').fill(payment_method_details_input.cardholder_name_text);
        
        // Country selection might be a dropdown or an input
        const country_dropdown_locator = this.page.getByLabel('Country or region');
        await country_dropdown_locator.fill(payment_method_details_input.country_or_region_text);
        
        await this.page.getByLabel('ZIP Code').last().fill(payment_method_details_input.billing_zip_code_text);
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
