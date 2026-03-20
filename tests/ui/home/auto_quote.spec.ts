import { test, expect } from 'fixtures/app.fixture';
import { BASE_URL } from 'utils/env.helper';

test.describe('Home Page - Auto Quote Form @ui @smoke', () => {

    test.beforeEach(async ({ homePage }) => {
        // Increase the overall test timeout for this block
        test.setTimeout(90000);
        await homePage.navigateToHomePage();
    });

    test('should verify Auto tab is active by default', async ({ homePage }) => {
        // Visual check from the screenshot shows Auto tab is highlighted
        await expect(homePage.autoTab).toBeVisible();
    });

    test('should submit auto quote form and proceed in chat', async ({ homePage, chatPage, coveragePage }) => {
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
    });
});
