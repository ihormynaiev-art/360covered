import { Page, Locator } from '@playwright/test';
import { BasePage } from 'pages/base.page';

export class HomePage extends BasePage {
    readonly auto_quote_tab_button_locator: Locator;
    readonly powersports_quote_tab_button_locator: Locator;
    readonly golf_carts_quote_tab_button_locator: Locator;
    readonly vehicle_identification_number_input_locator: Locator;
    readonly vehicle_mileage_input_locator: Locator;
    readonly vehicle_state_dropdown_locator: Locator;
    readonly get_instant_quote_submit_button_locator: Locator;
    readonly start_new_quote_modal_button_locator: Locator;
    readonly free_vin_check_navigation_button_locator: Locator;
    readonly check_vin_submit_button_locator: Locator;
    readonly get_insurance_quote_cta_button_locator: Locator;
    readonly vehicle_current_mileage_spinbutton_locator: Locator;
    readonly confirm_details_submit_button_locator: Locator;

    constructor(page: Page) {
        super(page);
        this.auto_quote_tab_button_locator = page.getByRole('button', { name: 'Auto' });
        this.powersports_quote_tab_button_locator = page.getByRole('button', { name: 'Powersports' });
        this.golf_carts_quote_tab_button_locator = page.getByRole('button', { name: 'Golf Carts' });
        this.vehicle_identification_number_input_locator = page.getByRole('textbox', { name: 'VIN' });
        this.vehicle_mileage_input_locator = page.getByRole('textbox', { name: 'Mileage' });
        this.vehicle_state_dropdown_locator = page.getByRole('combobox');
        this.get_instant_quote_submit_button_locator = page.getByRole('button', { name: 'Get Instant Quote' });
        this.start_new_quote_modal_button_locator = page.getByRole('button', { name: 'Start New Quote' });
        this.free_vin_check_navigation_button_locator = page.getByRole('button', { name: 'Free VIN Check' });
        this.check_vin_submit_button_locator = page.getByRole('button', { name: 'Check VIN' });
        this.get_insurance_quote_cta_button_locator = page.getByRole('button', { name: 'Get Insurance Quote' });
        this.vehicle_current_mileage_spinbutton_locator = page.getByRole('spinbutton', { name: 'Current Mileage' });
        this.confirm_details_submit_button_locator = page.getByRole('button', { name: 'Confirm' });
    }

    async navigate_to_home_page(): Promise<void> {
        await this.navigate_to('/');

        const primary_search_form_container_locator = this.page.locator('#search-filters');
        const secondary_form_indicator_locator = this.vehicle_identification_number_input_locator;
        
        const home_page_readiness_indicator_locator = primary_search_form_container_locator.or(secondary_form_indicator_locator).or(this.free_vin_check_navigation_button_locator);

        try {
            await home_page_readiness_indicator_locator.first().waitFor({ state: 'visible', timeout: 30000 });
        } catch (navigation_timeout_error) {
            const failure_page_url_string = this.page.url();
            const failure_page_html_content = await this.page.content();
            
            console.error(`ERROR: Home page form failed to load at ${failure_page_url_string}`);
            console.error(`Page HTML snippet: ${failure_page_html_content.substring(0, 1024)}`);
            const navigation_timeout_error_message_string = navigation_timeout_error instanceof Error ? navigation_timeout_error.message : String(navigation_timeout_error);
            throw new Error(`Home page form visibility timeout. URL: ${failure_page_url_string}. Original Error: ${navigation_timeout_error_message_string}`);
        }
    }

    async perform_free_vin_check_process(vin_number_string: string): Promise<void> {
        await this.click_element_locator(this.free_vin_check_navigation_button_locator);
        await this.fill_input_locator(this.vehicle_identification_number_input_locator, vin_number_string);
        await this.click_element_locator(this.check_vin_submit_button_locator);
        
        // After check, we should be on the results page where we can get an insurance quote
        await this.get_insurance_quote_cta_button_locator.waitFor({ state: 'visible', timeout: 30000 });
        await this.click_element_locator(this.get_insurance_quote_cta_button_locator);
    }

    async submit_vin_quote_request_form(mileage_string: string, state_name_string: string): Promise<void> {
        await this.vehicle_current_mileage_spinbutton_locator.waitFor({ state: 'visible', timeout: 30000 });
        await this.vehicle_current_mileage_spinbutton_locator.fill(mileage_string);
        
        await this.vehicle_state_dropdown_locator.click();
        const state_selection_option_locator = this.page.getByRole('option', { name: state_name_string, exact: false }).or(
            this.page.locator('div').filter({ hasText: new RegExp(`^${state_name_string}$`) })
        ).first();
        await state_selection_option_locator.click();

        await this.click_element_locator(this.confirm_details_submit_button_locator);

        // Handle the Welcome Back modal if it appears
        try {
            await this.start_new_quote_modal_button_locator.waitFor({ state: 'visible', timeout: 10000 });
            await this.click_element_locator(this.start_new_quote_modal_button_locator);
            await this.page.waitForLoadState('load');
        } catch (modal_not_found_error) {
            console.log('Welcome modal was not displayed, continuing flow.');
        }
    }

    async fill_auto_quote_form_with_details(vin_number_string: string, vehicle_mileage_string: string, state_name_string: string): Promise<void> {
        await this.vehicle_identification_number_input_locator.waitFor({ state: 'visible', timeout: 30000 });
        
        await this.fill_input_locator(this.vehicle_identification_number_input_locator, vin_number_string);
        await this.fill_input_locator(this.vehicle_mileage_input_locator, vehicle_mileage_string);

        await this.vehicle_state_dropdown_locator.click();
        
        const state_selection_option_locator = this.page.getByRole('option', { name: state_name_string, exact: false }).or(
            this.page.locator('div').filter({ hasText: new RegExp(`^${state_name_string}$`) })
        ).first();

        await state_selection_option_locator.click();

        await this.click_element_locator(this.get_instant_quote_submit_button_locator);

        try {
            await this.start_new_quote_modal_button_locator.waitFor({ state: 'visible', timeout: 10000 });
            await this.click_element_locator(this.start_new_quote_modal_button_locator);
            await this.page.waitForLoadState('load');
        } catch (modal_not_found_error) {
            console.log('Welcome modal was not displayed, continuing flow.');
        }
    }
}
