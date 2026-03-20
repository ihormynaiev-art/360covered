import { Page, Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(path: string): Promise<void> {
        await this.page.goto(path);
    }

    async clickElement(locator: Locator): Promise<void> {
        await locator.click();
    }

    async fillInput(locator: Locator, textValue: string): Promise<void> {
        await locator.fill(textValue);
    }

    async getElementText(locator: Locator): Promise<string> {
        return await locator.innerText();
    }

    async waitForElementVisible(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' });
    }

    async waitForElementHidden(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'hidden' });
    }

    async waitForPageUrl(urlPattern: string | RegExp): Promise<void> {
        await this.page.waitForURL(urlPattern);
    }

    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }
}
