import { Page, Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate_to(relative_path_string: string): Promise<void> {
        await this.page.goto(relative_path_string);
        // Ensure the page is somewhat settled before continuing
        await this.page.waitForLoadState('domcontentloaded');
    }

    async click_element_locator(element_locator: Locator): Promise<void> {
        await element_locator.waitFor({ state: 'visible', timeout: 15000 });
        await element_locator.click();
    }

    async fill_input_locator(input_element_locator: Locator, text_value_string: string): Promise<void> {
        await input_element_locator.waitFor({ state: 'visible', timeout: 30000 });
        await input_element_locator.fill(text_value_string);
    }

    async get_element_text(element_locator: Locator): Promise<string> {
        return await element_locator.innerText();
    }

    async wait_for_element_is_visible(element_locator: Locator): Promise<void> {
        await element_locator.waitFor({ state: 'visible' });
    }

    async wait_for_element_is_hidden(element_locator: Locator): Promise<void> {
        await element_locator.waitFor({ state: 'hidden' });
    }

    async wait_for_page_url_match(url_pattern_string: string | RegExp): Promise<void> {
        await this.page.waitForURL(url_pattern_string);
    }

    async get_page_title_string(): Promise<string> {
        return await this.page.title();
    }
}
