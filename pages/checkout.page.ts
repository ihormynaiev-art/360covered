import { Page, Locator } from '@playwright/test';
import { BasePage } from 'pages/base.page';

export class CheckoutPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Clicks the "Continue to Checkout" button.
     */
    async continue_to_checkout(): Promise<void> {
        const continue_to_checkout_button = this.page.getByRole('button', { name: 'Continue to Checkout' });
        await continue_to_checkout_button.waitFor({ state: 'visible', timeout: 30000 });
        await continue_to_checkout_button.click();
        
        await this.page.waitForLoadState('load');
    }

    /**
     * Fills the customer information form with the provided data.
     */
    async fill_customer_information_form(customer_form_input_data: {
        first_name_string: string,
        last_name_string: string,
        email_address_string: string,
        phone_number_string: string,
        street_address_string: string,
        city_name_string: string,
        state_code_string: string,
        zip_code_string: string
    }): Promise<void> {
        await this.page.getByLabel('First Name').fill(customer_form_input_data.first_name_string);
        await this.page.getByLabel('Last Name').fill(customer_form_input_data.last_name_string);
        await this.page.getByLabel('Email').fill(customer_form_input_data.email_address_string);
        await this.page.getByLabel('Phone').fill(customer_form_input_data.phone_number_string);
        await this.page.getByLabel('Street Address').fill(customer_form_input_data.street_address_string);
        await this.page.getByLabel('City').fill(customer_form_input_data.city_name_string);
        await this.page.getByLabel('State').fill(customer_form_input_data.state_code_string);
        await this.page.getByLabel('ZIP Code').fill(customer_form_input_data.zip_code_string);
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

        const billing_zip_code_locator = this.page.locator('#billingPostalCode').or(this.page.getByLabel(/ZIP Code/i).last());
        await billing_zip_code_locator.waitFor({ state: 'visible', timeout: 5000 });
        await billing_zip_code_locator.fill(payment_method_details_input.billing_zip_code_text);

        const save_payment_info_checkbox_locator = this.page.getByLabel(/Save my information/i);
        if (await save_payment_info_checkbox_locator.isVisible({ timeout: 3000 }).catch(() => false)) {
            if (await save_payment_info_checkbox_locator.isChecked()) {
                await save_payment_info_checkbox_locator.uncheck();
            }
        }
    }

    /**
     * Clicks the final payment confirmation button.
     */
     async click_confirm_payment_button(): Promise<void> {
        const confirm_button_locator = this.page.locator('xpath=//*[@id="payment-form"]/div/div/div/div[3]/div/div[2]/div/button/div[3]');
        await confirm_button_locator.waitFor({ state: 'visible', timeout: 30000 });
        await confirm_button_locator.click();
    }

    async verify_successful_purchase_confirmation(): Promise<void> {
        const success_title_locator = this.page.getByText(/You[''\u2019]re Covered!/);
        const success_description_locator = this.page.getByText('Your vehicle protection is now active');
        
        await success_title_locator.waitFor({ state: 'visible', timeout: 60000 });
        await success_description_locator.waitFor({ state: 'visible', timeout: 10000 });
    }

    /**
     * Clicks the "Complete Purchase" button.
     */
    async complete_purchase_process(): Promise<void> {
        const complete_purchase_button = this.page.getByRole('button', { name: 'Complete Purchase' });
        await complete_purchase_button.waitFor({ state: 'visible', timeout: 30000 });
        await complete_purchase_button.click();
        
        await this.page.waitForLoadState('load');
    }
}
