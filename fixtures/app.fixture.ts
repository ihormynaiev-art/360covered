import { test as base } from '@playwright/test';
import { LoginPage } from 'pages/login.page';
import { HeaderComponent } from 'pages/components/header.component';

type PageFixtures = {
    loginPage: LoginPage;
    headerComponent: HeaderComponent;
};

export const test = base.extend<PageFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    headerComponent: async ({ page }, use) => {
        await use(new HeaderComponent(page));
    },
});

export { expect } from '@playwright/test';
