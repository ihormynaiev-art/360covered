import { Page, Locator } from '@playwright/test';
import { BasePage } from 'pages/base.page';

export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('button[type="submit"]');
        this.errorMessage = page.locator('.error-message');
    }

    async navigateToLoginPage(): Promise<void> {
        await this.navigateTo('/login');
    }

    async performLogin(username: string, password: string): Promise<void> {
        await this.fillInput(this.usernameInput, username);
        await this.fillInput(this.passwordInput, password);
        await this.clickElement(this.loginButton);
    }

    async getLoginErrorMessageText(): Promise<string> {
        return await this.getElementText(this.errorMessage);
    }
}
