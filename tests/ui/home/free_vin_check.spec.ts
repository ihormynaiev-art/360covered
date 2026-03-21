import { test, expect } from 'fixtures/app.fixture';

test.describe('Home Page - Free VIN Check Flow @ui @smoke @regression', () => {

    test.beforeEach(async ({ homePage }) => {
        // Устанавливаем увеличенный таймаут для всего флоу
        test.setTimeout(90000);
        await homePage.navigate_to_home_page();
    });

    test('should perform free vin check and complete purchase with financing', async ({ homePage, chatPage, coveragePage, checkoutPage }) => {
        const USER_VIN_NUMBER_STRING = '3GNAXHEV2JL379307';
        const USER_VEHICLE_MILEAGE_STRING = '40000';
        const USER_STATE_NAME_STRING = 'FL';
        const FINANCE_PLAN_OPTION_NAME_STRING = 'Finance $49/mo for 36 months';

        // 1. Выполняем бесплатную проверку VIN и переходим к получению оффера
        await homePage.perform_free_vin_check_process(USER_VIN_NUMBER_STRING);

        // 2. Заполняем данные для котировки (миляж через spinbutton и выбор штата)
        await homePage.submit_vin_quote_request_form(USER_VEHICLE_MILEAGE_STRING, USER_STATE_NAME_STRING);

        // 3. Отвечаем на вопросы в чате
        await chatPage.answer_chat_question_by_selecting_option('miles do you drive per year?', '-20K');
        await chatPage.answer_chat_question_by_selecting_option('personal use?', 'Personal');

        // 4. Выбор покрытия (POWERTRAIN PLUS)
        await coveragePage.view_coverage_plan_details('POWERTRAIN PLUS', 'Provider A');
        await coveragePage.select_chosen_coverage_plan();

        // 5. Оформление заказа (Checkout)
        await checkoutPage.continue_to_checkout();
        await checkoutPage.fill_customer_information_form({
            first_name_string: 'Test',
            last_name_string: 'QA',
            email_address_string: 'ihormynaiev@greenice.net',
            phone_number_string: '0123456789',
            street_address_string: 'Test Street',
            city_name_string: 'Test City',
            state_code_string: 'FL',
            zip_code_string: '00000'
        });

        // 6. Выбор рассрочки (Financing) и завершение оформления
        await checkoutPage.select_financing_payment_plan(FINANCE_PLAN_OPTION_NAME_STRING);
        await checkoutPage.complete_purchase_process();

        // 7. Платеж через Stripe
        await checkoutPage.fill_payment_method_details({
            card_number_text: '4242 4242 4242 4242',
            expiration_date_text: '12 / 30',
            cvc_code_text: '000',
            cardholder_name_text: 'Test QA',
            country_or_region_text: 'United States',
            billing_zip_code_text: '00000'
        });

        await checkoutPage.click_confirm_payment_button();

        // 8. Валидация успешного завершения
        await checkoutPage.verify_successful_purchase_confirmation();
    });
});
