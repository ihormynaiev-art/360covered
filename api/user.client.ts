import { APIRequestContext } from '@playwright/test';
import { BaseClient } from 'api/base.client';

export class UserClient extends BaseClient {
    constructor(requestContext: APIRequestContext, baseApiUrl: string) {
        super(requestContext, baseApiUrl);
    }

    async getAllUsers() {
        return await this.sendGetRequest('/users');
    }

    async getUserById(userId: string) {
        return await this.sendGetRequest(`/users/${userId}`);
    }

    async createUser(userPayload: object) {
        return await this.sendPostRequest('/users', userPayload);
    }

    async updateUser(userId: string, userUpdatePayload: object) {
        return await this.sendPutRequest(`/users/${userId}`, userUpdatePayload);
    }

    async deleteUser(userId: string) {
        return await this.sendDeleteRequest(`/users/${userId}`);
    }
}
