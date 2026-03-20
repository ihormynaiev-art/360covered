import { test, expect } from 'fixtures/app.fixture';
import { BASE_URL } from 'utils/env.helper';

test.describe('Home Page - Auto Quote Form @ui @smoke', () => {

    test.beforeEach(async ({ homePage }) => {
        // Increase the overall test timeout for this block
        test.setTimeout(90000);
        await homePage.navigateToHomePage();
    });

    test('should submit auto quote form and proceed in chat', async ({ homePage, chatPage, coveragePage, checkoutPage }) => {
        const USER_VIN = '3GNAXHEV2JL379307';
        const USER_MILEAGE = '40000';
        const USER_STATE = 'FL';

        await homePage.fillAutoQuoteForm(USER_VIN, USER_MILEAGE, USER_STATE);

        // Interact with the first chat question (Mileage)
        await chatPage.answerChatQuestion('miles do you drive per year?', '20K+');

        // Interact with the second chat question (Usage)
        await chatPage.answerChatQuestion('personal use?', 'Personal');

        // Select the POWERTRAIN plan from Provider A
        await coveragePage.viewPlanDetails('POWERTRAIN', 'Provider A');

        // Click "Select This Plan" in the modal
        await coveragePage.selectPlan();

        // Final step: Continue to checkout
        await checkoutPage.continueToCheckout();

        // Fill customer information
        await checkoutPage.fillCustomerInformation({
            firstName: 'Test',
            lastName: 'QA',
            email: 'ihor.mynaiev@greenice.net',
            phone: '01234567890',
            streetAddress: '123 Main St',
            city: 'Miami',
            state: 'FL',
            zipCode: '33101'
        });

        // Click "Complete Purchase"
        await checkoutPage.completePurchase();

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
