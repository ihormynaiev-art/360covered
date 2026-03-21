import { Page, Locator } from '@playwright/test';
import { BasePage } from 'pages/base.page';

export class ChatPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Waits for a specific question text in the chat and clicks the corresponding option.
     * Uses the last visible matching button to handle chat history correctly.
     */
    async answer_chat_question_by_selecting_option(question_search_text_string: string, option_button_name_string: string): Promise<void> {
        // 1. Wait for the question text to be visible (using substring match)
        const chat_question_text_locator = this.page.locator('div, p, span')
            .filter({ hasText: question_search_text_string })
            .last();
        
        await chat_question_text_locator.waitFor({ state: 'visible', timeout: 30000 });
        
        // 2. Locate the option button - always take the LAST one to avoid history issues
        const chat_option_button_locator = this.page.getByRole('button', { name: option_button_name_string, exact: true }).last();
        
        await chat_option_button_locator.waitFor({ state: 'visible', timeout: 15000 });
        await chat_option_button_locator.scrollIntoViewIfNeeded();
        
        // 3. Brief pause for animations (common in chat interfaces)
        await this.page.waitForTimeout(1000);
        
        // 4. Click the element
        try {
            await chat_option_button_locator.click({ timeout: 5000 });
        } catch (error) {
            console.warn(`Standard click failed for "${option_button_name_string}", fallback to dispatchEvent.`);
            await chat_option_button_locator.dispatchEvent('click');
        }
        
        // 5. Wait for the chat to process the response
        await this.page.waitForTimeout(1500);
    }
}
