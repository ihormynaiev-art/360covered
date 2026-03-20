import { test as base } from '@playwright/test';
import { HomePage } from 'pages/home.page';
import { ChatPage } from 'pages/chat.page';
import { LoginPage } from 'pages/login.page';
import { CoveragePage } from 'pages/coverage.page';
import { HeaderComponent } from 'pages/components/header.component';

type PageFixtures = {
    homePage: HomePage;
    chatPage: ChatPage;
    coveragePage: CoveragePage;
    loginPage: LoginPage;
    headerComponent: HeaderComponent;
};

export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    chatPage: async ({ page }, use) => {
        await use(new ChatPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    coveragePage: async ({ page }, use) => {
        await use(new CoveragePage(page));
    },
    headerComponent: async ({ page }, use) => {
        await use(new HeaderComponent(page));
    },
});

export { expect } from '@playwright/test';
