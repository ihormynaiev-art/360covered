export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    MODERATOR: 'moderator',
} as const;

export const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export const VALIDATION_MESSAGES = {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
    LOGIN_FAILED: 'Invalid username or password',
} as const;

export const TIMEOUTS = {
    SHORT_WAIT_MILLISECONDS: 3000,
    MEDIUM_WAIT_MILLISECONDS: 10000,
    LONG_WAIT_MILLISECONDS: 30000,
} as const;
