import * as fs from 'fs';
import * as path from 'path';

/**
 * Generates the environment.properties file for Allure report.
 * This file is required to display environment information in the Allure report dashboard.
 */
async function generate_allure_environment_properties_file_execution(): Promise<void> {
    const allure_results_directory_path_string = path.resolve(process.cwd(), 'allure-results');

    // Ensure the results directory exists before writing the properties file
    if (!fs.existsSync(allure_results_directory_path_string)) {
        fs.mkdirSync(allure_results_directory_path_string, { recursive: true });
    }

    const test_environment_name_string = process.env.ENV || 'dev';
    const base_url_string = process.env.BASE_URL || 'https://dev.get360covered.com/';
    const operating_system_platform_string = process.platform;
    const node_js_runtime_version_string = process.version;

    // Format the content for environment.properties
    const allure_environment_properties_content_string = [
        `Environment=${test_environment_name_string}`,
        `Base_URL=${base_url_string}`,
        `OS=${operating_system_platform_string}`,
        `Node_Version=${node_js_runtime_version_string}`,
        `Playwright_Version=${process.env.npm_package_devDependencies__playwright_test || '1.50.0'}`
    ].join('\n');

    const environment_properties_file_destination_path_string = path.join(allure_results_directory_path_string, 'environment.properties');

    fs.writeFileSync(
        environment_properties_file_destination_path_string,
        allure_environment_properties_content_string
    );

    console.log(`Allure environment properties file generated at: ${environment_properties_file_destination_path_string}`);
}

export default generate_allure_environment_properties_file_execution;
