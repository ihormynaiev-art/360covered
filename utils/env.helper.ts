import dotenv from 'dotenv';
import path from 'path';

const ENVIRONMENT = process.env.ENV || 'dev';
dotenv.config({ path: path.resolve(process.cwd(), 'config', `.env.${ENVIRONMENT}`) });

export function getEnvironmentVariable(variableName: string): string {
    const environmentVariableValue = process.env[variableName];
    if (!environmentVariableValue) {
        throw new Error(`Environment variable "${variableName}" is not defined in .env.${ENVIRONMENT}`);
    }
    return environmentVariableValue;
}

export const BASE_URL = getEnvironmentVariable('BASE_URL');
export const API_URL = getEnvironmentVariable('API_URL');
export const ADMIN_USERNAME = getEnvironmentVariable('ADMIN_USERNAME');
export const ADMIN_PASSWORD = getEnvironmentVariable('ADMIN_PASSWORD');
export const USER_USERNAME = getEnvironmentVariable('USER_USERNAME');
export const USER_PASSWORD = getEnvironmentVariable('USER_PASSWORD');
