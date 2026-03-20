import { Page, Locator } from '@playwright/test';
import { BasePage } from 'pages/base.page';

export class HomePage extends BasePage {
    readonly autoTab: Locator;
    readonly powersportsTab: Locator;
    readonly golfCartsTab: Locator;
    readonly vinInput: Locator;
    readonly mileageInput: Locator;
    readonly stateDropdown: Locator;
    readonly getInstantQuoteButton: Locator;
    readonly startNewQuoteButton: Locator;

    constructor(page: Page) {
        super(page);
        const searchContainer = page.locator('#search-filters');
        this.autoTab = searchContainer.getByRole('button', { name: 'Auto' });
        this.powersportsTab = searchContainer.getByRole('button', { name: 'Powersports' });
        this.golfCartsTab = searchContainer.getByRole('button', { name: 'Golf Carts' });
        this.vinInput = searchContainer.getByRole('textbox', { name: 'VIN' });
        this.mileageInput = searchContainer.getByRole('textbox', { name: 'Mileage' });
        this.stateDropdown = searchContainer.getByRole('combobox');
        this.getInstantQuoteButton = searchContainer.getByRole('button', { name: 'Get Instant Quote' });
        this.startNewQuoteButton = page.getByRole('button', { name: 'Start New Quote' });
    }

    async navigateToHomePage(): Promise<void> {
        await this.navigateTo('/');
    }

    async fillAutoQuoteForm(vehicleIdentificationNumber: string, vehicleMileage: string, stateCodeOrName: string): Promise<void> {
        await this.fillInput(this.vinInput, vehicleIdentificationNumber);
        await this.fillInput(this.mileageInput, vehicleMileage);
        
        await this.stateDropdown.click();
        const stateOption = this.page.getByRole('option', { name: stateCodeOrName, exact: false }).or(
            this.page.locator('div').filter({ hasText: new RegExp(`^${stateCodeOrName}$`) })
        );
        await stateOption.first().click();
        
        await this.clickElement(this.getInstantQuoteButton);

        // Robust handling of the 'Welcome Back' modal
        try {
            // Wait up to 10 seconds for the modal to appear
            await this.startNewQuoteButton.waitFor({ state: 'visible', timeout: 10000 });
            await this.clickElement(this.startNewQuoteButton);
            
            // After clicking Start New Quote, we might need a small pause for navigation to trigger
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            // If the modal doesn't appear within 10s, we assume it's a new VIN and continue
            console.log('Modal "Welcome Back" did not appear, proceeding with the flow.');
        }
    }
}
