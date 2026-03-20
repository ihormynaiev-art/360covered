import { Page, Locator } from '@playwright/test';

export class HeaderComponent {
    readonly page: Page;
    readonly logoLink: Locator;
    readonly navigationMenu: Locator;
    readonly userProfileButton: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logoLink = page.locator('header .logo');
        this.navigationMenu = page.locator('header nav');
        this.userProfileButton = page.locator('header .user-profile');
        this.logoutButton = page.locator('header .logout');
    }

    async clickLogo(): Promise<void> {
        await this.logoLink.click();
    }

    async clickUserProfile(): Promise<void> {
        await this.userProfileButton.click();
    }

    async performLogout(): Promise<void> {
        await this.clickUserProfile();
        await this.logoutButton.click();
    }

    async isNavigationMenuVisible(): Promise<boolean> {
        return await this.navigationMenu.isVisible();
    }
}
