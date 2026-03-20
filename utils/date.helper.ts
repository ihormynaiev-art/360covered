export function formatDateToIso(date: Date): string {
    return date.toISOString();
}

export function formatDateToLocaleString(date: Date, locale: string = 'en-US'): string {
    return date.toLocaleDateString(locale);
}

export function addDaysToDate(date: Date, daysToAdd: number): Date {
    const dateWithAddedDays = new Date(date);
    dateWithAddedDays.setDate(dateWithAddedDays.getDate() + daysToAdd);
    return dateWithAddedDays;
}

export function getDateDifferenceInDays(startDate: Date, endDate: Date): number {
    const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
    const timeDifferenceMilliseconds = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(timeDifferenceMilliseconds / MILLISECONDS_PER_DAY);
}

export function isDateInPast(date: Date): boolean {
    return date.getTime() < Date.now();
}

export function isDateInFuture(date: Date): boolean {
    return date.getTime() > Date.now();
}
