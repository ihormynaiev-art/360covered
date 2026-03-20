import { test as base } from '@playwright/test';
import { UserClient } from 'api/user.client';
import { API_URL } from 'utils/env.helper';

type ApiFixtures = {
    userClient: UserClient;
};

export const test = base.extend<ApiFixtures>({
    userClient: async ({ request }, use) => {
        await use(new UserClient(request, API_URL));
    },
});

export { expect } from '@playwright/test';
