import { faker } from '@faker-js/faker';

export function generateRandomEmail(): string {
    return faker.internet.email();
}

export function generateRandomFirstName(): string {
    return faker.person.firstName();
}

export function generateRandomLastName(): string {
    return faker.person.lastName();
}

export function generateRandomFullName(): string {
    return faker.person.fullName();
}

export function generateRandomPassword(length: number = 12): string {
    return faker.internet.password({ length });
}

export function generateRandomPhoneNumber(): string {
    return faker.phone.number();
}

export function generateRandomUuid(): string {
    return faker.string.uuid();
}
