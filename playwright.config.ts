import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

const ENVIRONMENT = process.env.ENV || 'dev';
dotenv.config({ path: path.resolve(__dirname, 'config', `.env.${ENVIRONMENT}`) });

export default defineConfig({
    globalSetup: require.resolve('./utils/allure_environment_setup.ts'),
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['list'],
        ['html', { open: 'never' }],
        ['allure-playwright'],
    ],
    use: {
        baseURL: process.env.BASE_URL || 'https://dev.get360covered.com/',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        // Better bot evasion settings
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 720 },
        locale: 'en-US',
        extraHTTPHeaders: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9',
        },
        ignoreHTTPSErrors: true,
        navigationTimeout: 45000,
        actionTimeout: 15000,
        httpCredentials: {
            username: process.env.BASIC_AUTH_USERNAME || 'devadmin',
            password: process.env.BASIC_AUTH_PASSWORD || 'SuperSecret123',
        },
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
    ],
});
