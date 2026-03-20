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
        // Find and fill Card number
        const card_number_locator = this.page.getByLabel(/Card number/i);
        await card_number_locator.waitFor({ state: 'visible', timeout: 10000 });
        await card_number_locator.fill(payment_method_details_input.card_number_text);

        // Find and fill Expiration date (based on provided HTML: aria-label="Expiration", id="cardExpiry")
        const expiration_date_locator = this.page.locator('#cardExpiry').or(this.page.getByLabel(/^Expiration$/i));
        await expiration_date_locator.waitFor({ state: 'visible', timeout: 5000 });
        await expiration_date_locator.fill(payment_method_details_input.expiration_date_text);

        // Find and fill CVC
        const cvc_locator = this.page.locator('#cardCvc').or(this.page.getByLabel(/^CVC$/i));
        await cvc_locator.waitFor({ state: 'visible', timeout: 5000 });
        await cvc_locator.fill(payment_method_details_input.cvc_code_text);

        // Find and fill Cardholder name
        const cardholder_name_locator = this.page.locator('#billingName').or(this.page.getByLabel(/Cardholder name/i));
        await cardholder_name_locator.waitFor({ state: 'visible', timeout: 5000 });
        await cardholder_name_locator.fill(payment_method_details_input.cardholder_name_text);

        // Find and select Country or region (it's a dropdown)
        const country_dropdown_locator = this.page.locator('#billingCountry').or(this.page.getByLabel(/Country or region/i));
        await country_dropdown_locator.waitFor({ state: 'visible', timeout: 5000 });
        await country_dropdown_locator.selectOption({ label: payment_method_details_input.country_or_region_text });

        // Find and fill Billing ZIP Code
        const billing_zip_code_locator = this.page.locator('#billingPostalCode').or(this.page.getByLabel(/ZIP Code/i).last());
        await billing_zip_code_locator.waitFor({ state: 'visible', timeout: 5000 });
        await billing_zip_code_locator.fill(payment_method_details_input.billing_zip_code_text);
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
