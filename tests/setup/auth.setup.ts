import { test as setup } from '@playwright/test';
import { USER_USERNAME, USER_PASSWORD, ADMIN_USERNAME, ADMIN_PASSWORD } from 'utils/env.helper';

const USER_STORAGE_STATE_PATH = 'storage-states/user-state.json';
const ADMIN_STORAGE_STATE_PATH = 'storage-states/admin-state.json';

setup('authenticate as user', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#username').fill(USER_USERNAME);
    await page.locator('#password').fill(USER_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/');
    await page.context().storageState({ path: USER_STORAGE_STATE_PATH });
});

setup('authenticate as admin', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#username').fill(ADMIN_USERNAME);
    await page.locator('#password').fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/');
    await page.context().storageState({ path: ADMIN_STORAGE_STATE_PATH });
});
