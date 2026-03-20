import { test, expect } from 'fixtures/api.fixture';

test.describe('Users API @api', () => {
    test('GET /users should return list of users', async ({ userClient }) => {
        const usersListResponse = await userClient.getAllUsers();

        expect(usersListResponse.ok()).toBeTruthy();
        expect(usersListResponse.status()).toBe(200);

        const usersListBody = await usersListResponse.json();
        expect(Array.isArray(usersListBody)).toBeTruthy();
    });

    test('POST /users should create a new user', async ({ userClient }) => {
        const newUserPayload = {
            name: 'John Doe',
            email: 'john.doe@example.com',
        };

        const createUserResponse = await userClient.createUser(newUserPayload);

        expect(createUserResponse.ok()).toBeTruthy();
        expect(createUserResponse.status()).toBe(201);
    });

    test('GET /users/:id should return a single user', async ({ userClient }) => {
        const singleUserResponse = await userClient.getUserById('1');

        expect(singleUserResponse.ok()).toBeTruthy();
        expect(singleUserResponse.status()).toBe(200);

        const singleUserBody = await singleUserResponse.json();
        expect(singleUserBody).toHaveProperty('id');
        expect(singleUserBody).toHaveProperty('name');
    });

    test('DELETE /users/:id should delete a user', async ({ userClient }) => {
        const deleteUserResponse = await userClient.deleteUser('1');

        expect(deleteUserResponse.ok()).toBeTruthy();
    });
});
