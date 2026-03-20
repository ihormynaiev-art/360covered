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
    async answerChatQuestion(questionText: string, optionName: string): Promise<void> {
        // 1. Wait for the question text to be visible (using substring match)
        const chatQuestionLocator = this.page.locator('div, p, span')
            .filter({ hasText: questionText })
            .last();
        
        await chatQuestionLocator.waitFor({ state: 'visible', timeout: 30000 });
        
        // 2. Locate the option button - always take the LAST one to avoid history issues
        const chatOptionLocator = this.page.getByRole('button', { name: optionName, exact: true }).last();
        
        await chatOptionLocator.waitFor({ state: 'visible', timeout: 15000 });
        await chatOptionLocator.scrollIntoViewIfNeeded();
        
        // 3. Brief pause for animations (common in chat interfaces)
        await this.page.waitForTimeout(1000);
        
        // 4. Click the element
        try {
            await chatOptionLocator.click({ timeout: 5000 });
        } catch (error) {
            console.warn(`Standard click failed for "${optionName}", fallback to dispatchEvent.`);
            await chatOptionLocator.dispatchEvent('click');
        }
        
        // 5. Wait for the chat to process the response
        await this.page.waitForTimeout(1500);
    }
}
