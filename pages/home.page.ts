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

    async navigate_to_home_page(): Promise<void> {
        await this.navigate_to('/');
        // Wait for the main search container to be visible as a signal the page is ready
        const search_filters_container = this.page.locator('#search-filters');
        await search_filters_container.waitFor({ state: 'visible', timeout: 30000 });
    }

    async fill_auto_quote_form_with_details(vin_number_string: string, vehicle_mileage_string: string, state_name_string: string): Promise<void> {
        // Ensure the form is ready and can be filled
        await this.vinInput.waitFor({ state: 'visible', timeout: 30000 });
        await this.fill_input_locator(this.vinInput, vin_number_string);
        await this.fill_input_locator(this.mileageInput, vehicle_mileage_string);
        
        await this.stateDropdown.click();
        // Updated state selection logic to be simpler and more direct
        const state_selection_option_locator = this.page.getByRole('option', { name: state_name_string, exact: false }).or(
            this.page.locator('div').filter({ hasText: new RegExp(`^${state_name_string}$`) })
        ).first();
        
        await state_selection_option_locator.click();
        
        await this.click_element_locator(this.getInstantQuoteButton);

        // Robust handling of the 'Welcome Back' modal
        try {
            // Wait up to 10 seconds for the modal to appear
            await this.startNewQuoteButton.waitFor({ state: 'visible', timeout: 10000 });
            await this.click_element_locator(this.startNewQuoteButton);
            
            // After clicking Start New Quote, we might need a small pause for navigation to trigger
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            // If the modal doesn't appear within 10s, we assume it's a new VIN and continue
            console.log('Modal "Welcome Back" did not appear, proceeding with the flow.');
        }
    }
}
