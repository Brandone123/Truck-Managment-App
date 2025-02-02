// currencyUtils.ts
export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
    // Check if the amount is not a valid number
    if (isNaN(amount)) {
        amount = 0; // Set amount to 0 if invalid
    }

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
}
