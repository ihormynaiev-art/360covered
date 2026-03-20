import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from 'pages/base.page';

export class CoveragePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Gets the plan block that contains the specified title.
     * @param planTitle Exact title of the plan (e.g. 'POWERTRAIN')
     */
    getPlanBlock(planTitle: string): Locator {
        // Find the div that contains the exact h3 heading
        return this.page.locator('div').filter({
            has: this.page.locator('h3', { hasText: new RegExp(`^${planTitle}$`) })
        }).first();
    }

    /**
     * Clicks "View Plan Details" button in the specified plan block and waits for the modal.
     * @param planTitle Exact title of the plan
     */
    async viewPlanDetails(planTitle: string): Promise<void> {
        const planBlockLocator = this.getPlanBlock(planTitle);
        await planBlockLocator.waitFor({ state: 'visible', timeout: 30000 });
        
        const detailsButtonLocator = planBlockLocator.getByRole('button', { name: 'View Plan Details' });
        await detailsButtonLocator.scrollIntoViewIfNeeded();
        await detailsButtonLocator.click();
        
        // Wait for the modal to appear
        const planDetailsModal = this.page.getByRole('dialog');
        await expect(planDetailsModal).toBeVisible({ timeout: 15000 });
        await expect(planDetailsModal).toContainText(planTitle);
    }
}
