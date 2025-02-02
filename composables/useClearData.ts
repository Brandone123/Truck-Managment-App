/**
 * A composable function that provides methods to clear page cookies and storage data (localStorage and sessionStorage).
 */
export function useClearData() {
    /**
     * Clears all cookies by setting their expiry date to a past date.
     */
    const clearCookies = (): void => {
        const cookies: string[] = document.cookie.split("; ");
        for (let cookie of cookies) {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            // Set the cookie to expire in the past
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
    };

    /**
     * Clears all data stored in localStorage.
     */
    const clearLocalStorage = (): void => {
        localStorage.clear();
    };

    /**
     * Clears all data stored in sessionStorage.
     */
    const clearSessionStorage = (): void => {
        sessionStorage.clear();
    };

    /**
     * Clears all cookies, localStorage, and sessionStorage.
     */
    const clearAllData = (): void => {
        clearCookies();
        clearLocalStorage();
        clearSessionStorage();
    };

    return {
        clearCookies,
        clearLocalStorage,
        clearSessionStorage,
        clearAllData,
    };
}
