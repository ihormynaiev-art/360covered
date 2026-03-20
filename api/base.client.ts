import { APIRequestContext } from '@playwright/test';

export class BaseClient {
    readonly requestContext: APIRequestContext;
    readonly baseApiUrl: string;

    constructor(requestContext: APIRequestContext, baseApiUrl: string) {
        this.requestContext = requestContext;
        this.baseApiUrl = baseApiUrl;
    }

    async sendGetRequest(endpointPath: string) {
        return await this.requestContext.get(`${this.baseApiUrl}${endpointPath}`);
    }

    async sendPostRequest(endpointPath: string, requestBody: object) {
        return await this.requestContext.post(`${this.baseApiUrl}${endpointPath}`, {
            data: requestBody,
        });
    }

    async sendPutRequest(endpointPath: string, requestBody: object) {
        return await this.requestContext.put(`${this.baseApiUrl}${endpointPath}`, {
            data: requestBody,
        });
    }

    async sendPatchRequest(endpointPath: string, requestBody: object) {
        return await this.requestContext.patch(`${this.baseApiUrl}${endpointPath}`, {
            data: requestBody,
        });
    }

    async sendDeleteRequest(endpointPath: string) {
        return await this.requestContext.delete(`${this.baseApiUrl}${endpointPath}`);
    }
}
