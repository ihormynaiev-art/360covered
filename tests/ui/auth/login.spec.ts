import { test, expect } from 'fixtures/app.fixture';
import { USER_USERNAME, USER_PASSWORD } from 'utils/env.helper';

test.describe('Login Page @ui', () => {
    test('should login with valid credentials', async ({ loginPage, page }) => {
        await loginPage.navigateToLoginPage();
        await loginPage.performLogin(USER_USERNAME, USER_PASSWORD);

        await page.waitForURL('/');
        await expect(page).toHaveURL('/');
    });

    test('should show error message with invalid credentials', async ({ loginPage }) => {
        await loginPage.navigateToLoginPage();
        await loginPage.performLogin('invalid@example.com', 'wrong_password');

        await loginPage.waitForElementVisible(loginPage.errorMessage);
        const loginErrorText = await loginPage.getLoginErrorMessageText();
        expect(loginErrorText).toBeTruthy();
    });

    test('should not login with empty credentials', async ({ loginPage }) => {
        await loginPage.navigateToLoginPage();
        await loginPage.performLogin('', '');

        await expect(loginPage.loginButton).toBeVisible();
    });
});
