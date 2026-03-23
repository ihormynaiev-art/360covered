import * as fs from 'fs';
import * as path from 'path';

/**
 * Generates the environment.properties file for Allure report.
 * This file is required to display environment information in the Allure report dashboard.
 */
async function generate_allure_environment_properties_file_execution(): Promise<void> {
    const allure_results_directory_path_string = path.resolve(process.cwd(), 'allure-results');

    // Clean previous results to avoid accumulating tests from old runs
    if (fs.existsSync(allure_results_directory_path_string)) {
        fs.rmSync(allure_results_directory_path_string, { recursive: true, force: true });
    }

    // Ensure the results directory exists before writing the properties file
    fs.mkdirSync(allure_results_directory_path_string, { recursive: true });

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

    // Generate executor.json to populate the "Executors" section in Allure
    const executor_json_file_destination_path_string = path.join(allure_results_directory_path_string, 'executor.json');
    if (process.env.CI) {
        const executor_json_content_object = {
            "name": "GitHub Actions",
            "type": "github",
            "url": `${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
            "buildOrder": process.env.GITHUB_RUN_NUMBER,
            "buildName": `GitHub Actions Run #${process.env.GITHUB_RUN_NUMBER}`,
            "buildUrl": `${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
        };
        fs.writeFileSync(executor_json_file_destination_path_string, JSON.stringify(executor_json_content_object, null, 2));
    } else {
        const executor_json_content_object = {
            "name": "Local Environment",
            "type": "local",
            "buildName": "Local Playwright Run"
        };
        fs.writeFileSync(executor_json_file_destination_path_string, JSON.stringify(executor_json_content_object, null, 2));
    }

    // Manage history trends by copying from the previous report to the current results
    const previous_allure_report_history_directory_absolute_path_string = path.resolve(process.cwd(), 'allure-report', 'history');
    const current_allure_results_history_directory_absolute_path_string = path.join(allure_results_directory_path_string, 'history');

    if (fs.existsSync(previous_allure_report_history_directory_absolute_path_string)) {
        try {
            // Using standard fs.cpSync (Node.js 16.7.0+) for recursive copy
            fs.cpSync(previous_allure_report_history_directory_absolute_path_string, current_allure_results_history_directory_absolute_path_string, { recursive: true, force: true });
            console.log(`Inherited Allure history trend data from: ${previous_allure_report_history_directory_absolute_path_string}`);
        } catch (history_cloning_error_object) {
            console.warn(`NOTICE: Could not copy Allure history data. Error: ${history_cloning_error_object instanceof Error ? history_cloning_error_object.message : String(history_cloning_error_object)}`);
        }
    } else {
        console.log('No previous Allure history found, skipping trend inheritance.');
    }
}

export default generate_allure_environment_properties_file_execution;
