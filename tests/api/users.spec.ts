import { test, expect } from '@playwright/test';

test.describe('Users API @api', () => {
    test('GET /users should return a response', async ({ request }) => {
        const usersListResponse = await request.get('https://jsonplaceholder.typicode.com/users');

        expect(usersListResponse.ok()).toBeTruthy();
        expect(usersListResponse.status()).toBe(200);

        const usersListBody = await usersListResponse.json();
        expect(Array.isArray(usersListBody)).toBeTruthy();
        expect(usersListBody.length).toBeGreaterThan(0);
    });

    test('GET /users/1 should return a single user', async ({ request }) => {
        const singleUserResponse = await request.get('https://jsonplaceholder.typicode.com/users/1');

        expect(singleUserResponse.ok()).toBeTruthy();
        expect(singleUserResponse.status()).toBe(200);

        const singleUserBody = await singleUserResponse.json();
        expect(singleUserBody).toHaveProperty('id', 1);
        expect(singleUserBody).toHaveProperty('name');
        expect(singleUserBody).toHaveProperty('email');
    });

    test('POST /users should create a new user', async ({ request }) => {
        const createUserResponse = await request.post('https://jsonplaceholder.typicode.com/users', {
            data: {
                name: 'John Doe',
                username: 'johndoe',
                email: 'john.doe@example.com',
            },
        });

        expect(createUserResponse.ok()).toBeTruthy();
        expect(createUserResponse.status()).toBe(201);

        const createdUserBody = await createUserResponse.json();
        expect(createdUserBody).toHaveProperty('id');
    });
});
