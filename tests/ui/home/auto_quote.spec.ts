import { test, expect } from 'fixtures/app.fixture';
import { BASE_URL } from 'utils/env.helper';

test.describe('Home Page - Auto Quote Form @ui @smoke @regression', () => {

    test.beforeEach(async ({ homePage }) => {
        // Increase the overall test timeout for this block
        test.setTimeout(90000);
        await homePage.navigate_to_home_page();
    });

    test('should submit auto quote form and proceed in chat', async ({ homePage, chatPage, coveragePage, checkoutPage }) => {
        test.info().annotations.push({ type: 'epic', description: 'Core Workflows' });
        test.info().annotations.push({ type: 'feature', description: 'Auto Quote' });
        test.info().annotations.push({ type: 'story', description: 'Submit Auto Quote Request' });

        const USER_VIN_NUMBER = '3GNAXHEV2JL379307';
        const USER_VEHICLE_MILEAGE = '40000';
        const USER_STATE_NAME = 'FL';

        await homePage.fill_auto_quote_form_with_details(USER_VIN_NUMBER, USER_VEHICLE_MILEAGE, USER_STATE_NAME);

        // Interact with the first chat question (Mileage)
        await chatPage.answer_chat_question_by_selecting_option('miles do you drive per year?', '20K+');

        // Interact with the second chat question (Usage)
        await chatPage.answer_chat_question_by_selecting_option('personal use?', 'Personal');

        // Select the POWERTRAIN plan from Provider A
        await coveragePage.view_coverage_plan_details('POWERTRAIN', 'Provider A');

        // Click "Select This Plan" in the modal
        await coveragePage.select_chosen_coverage_plan();

        // Final step: Continue to checkout
        await checkoutPage.continue_to_checkout();

        // Fill customer information
        await checkoutPage.fill_customer_information_form({
            first_name_string: 'Test',
            last_name_string: 'QA',
            email_address_string: 'ihor.mynaiev@greenice.net',
            phone_number_string: '2015550123',
            street_address_string: '123 Main St',
            city_name_string: 'Miami',
            state_code_string: 'FL',
            zip_code_string: '33101'
        });

        // Click "Complete Purchase"
        await checkoutPage.complete_purchase_process();

        // Fill payment information
        await checkoutPage.fill_payment_method_details({
            card_number_text: '4242 4242 4242 4242',
            expiration_date_text: '12 / 30',
            cvc_code_text: '111',
            cardholder_name_text: 'TestQA',
            country_or_region_text: 'United States',
            billing_zip_code_text: '00000'
        });

        // Click final confirm or pay button
        await checkoutPage.click_confirm_payment_button();

        // Verify successful purchase
        await checkoutPage.verify_successful_purchase_confirmation();
    });
});
