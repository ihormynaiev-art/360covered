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
    getPlanBlock(planTitle: string, providerName?: string): Locator {
        if (providerName && planTitle) {
            const planId = planTitle.toLowerCase().replace(/\s+/g, '_');
            const providerId = providerName.toLowerCase().replace(/\s+/g, '_');
            const cardId = `plan-card-${providerId}-${planId}`;
            
            // Try to find by the ID structure if it exists
            const cardLocator = this.page.locator(`[id="${cardId}"], [id*="${cardId}"]`);
            return cardLocator.first();
        }

        // Fallback to text filtering if ID is not workable
        return this.page.locator('div').filter({
            has: this.page.locator('h3', { hasText: new RegExp(`^${planTitle}$`, 'i') })
        }).first();
    }

    /**
     * Clicks "View Plan Details" button in the specified plan block.
     */
    async viewPlanDetails(planTitle: string, providerName?: string): Promise<void> {
        const planBlockLocator = this.getPlanBlock(planTitle, providerName);
        await planBlockLocator.waitFor({ state: 'visible', timeout: 30000 });
        
        const detailsButtonLocator = planBlockLocator.getByRole('button', { name: 'View Plan Details' });
        await detailsButtonLocator.scrollIntoViewIfNeeded();
        await detailsButtonLocator.click();
        
        // Wait for the modal to appear
        const planDetailsModal = this.page.getByRole('dialog');
        await expect(planDetailsModal).toBeVisible({ timeout: 15000 });
    }

    /**
     * Clicks the "Select This Plan" button in the open modal.
     */
    async selectPlan(): Promise<void> {
        const selectPlanButton = this.page.getByRole('button', { name: 'Select This Plan' });
        await selectPlanButton.waitFor({ state: 'visible', timeout: 10000 });
        await selectPlanButton.click();
        
        // Wait for potential navigation or modal close
        await this.page.waitForLoadState('networkidle');
    }
}
