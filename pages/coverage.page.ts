import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from 'pages/base.page';

export class CoveragePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Gets the plan block that contains the specified title and provider.
     * Uses ID if provider and title are given to be highly precise.
     */
    get_coverage_plan_block_locator(plan_title_string: string, provider_name_string?: string): Locator {
        if (provider_name_string && plan_title_string) {
            const plan_identifier_string = plan_title_string.toLowerCase().replace(/\s+/g, '_');
            const provider_identifier_string = provider_name_string.toLowerCase().replace(/\s+/g, '_');
            const plan_card_id_string = `plan-card-${provider_identifier_string}-${plan_identifier_string}`;
            
            // Try to find by the ID structure if it exists
            const plan_card_locator = this.page.locator(`[id="${plan_card_id_string}"], [id*="${plan_card_id_string}"]`);
            return plan_card_locator.first();
        }

        // Fallback to text filtering if ID is not workable
        return this.page.locator('div').filter({
            has: this.page.locator('h3', { hasText: new RegExp(`^${plan_title_string}$`, 'i') })
        }).first();
    }

    /**
     * Clicks "View Plan Details" button in the specified plan block.
     */
    async view_coverage_plan_details(plan_title_string: string, provider_name_string?: string): Promise<void> {
        const plan_block_locator = this.get_coverage_plan_block_locator(plan_title_string, provider_name_string);
        await plan_block_locator.waitFor({ state: 'visible', timeout: 30000 });
        
        const details_button_locator = plan_block_locator.getByRole('button', { name: 'View Plan Details' });
        await details_button_locator.scrollIntoViewIfNeeded();
        await details_button_locator.click();
        
        // Wait for the modal to appear
        const plan_details_dialog_modal = this.page.getByRole('dialog');
        await expect(plan_details_dialog_modal).toBeVisible({ timeout: 15000 });
    }

    /**
     * Clicks the "Select This Plan" button in the open modal.
     */
    async select_chosen_coverage_plan(): Promise<void> {
        const select_plan_button_locator = this.page.getByRole('button', { name: 'Select This Plan' });
        await select_plan_button_locator.waitFor({ state: 'visible', timeout: 10000 });
        await select_plan_button_locator.click();
        
        await this.page.waitForLoadState('load');
    }
}
