import { Page, Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate_to(relative_path_string: string): Promise<void> {
        const page_navigation_response = await this.page.goto(relative_path_string);
        
        if (!page_navigation_response) {
            throw new Error(`Navigation to ${relative_path_string} failed: No response received from server.`);
        }
        
        const response_status_number = page_navigation_response.status();
        const current_page_url_string = this.page.url();
        
        console.log(`Navigated to: ${current_page_url_string} | Status: ${response_status_number}`);

        if (response_status_number >= 400) {
            throw new Error(`HTTP Error ${response_status_number} when navigating to ${current_page_url_string}`);
        }

        // Ensure the page has basic structure before continuing
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
