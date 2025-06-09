import {
    COOKIE_TOKEN_KEY,
    COOKIE_TOKEN_EXPIRED,
    COOKIE_SESSION_KEY,
    COOKIE_SESSION_EXPIRED,
    COOKIE_TOKEN_KEY_ADMIN, COOKIE_TOKEN_KEY_PHARMACIST
} from '@/utils/constants';

/**
 * Helper function to check if code is running in browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Sets a cookie with the given name and value
 * @param name Cookie name
 * @param value Cookie value
 * @param maxAge Maximum age in seconds
 */
export const setCookie = (name: string, value: string, maxAge: number) => {
    if (!isBrowser) return;

    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}`;
};

/**
 * Gets a cookie by name
 * @param name Cookie name
 * @returns Cookie value or undefined
 */
export const getCookie = (name: string): string | undefined => {
    if (!isBrowser) return undefined;

    const cookies = document.cookie.split(';')
        .map(cookie => cookie.trim());
    const cookie = cookies.find(item => item.startsWith(`${name}=`));

    if (!cookie) return undefined;

    const [, value] = cookie.split('=');
    return decodeURIComponent(value);
};

/**
 * Deletes a cookie by name
 * @param name Cookie name
 */
export const deleteCookie = (name: string) => {
    if (!isBrowser) return;

    document.cookie = `${name}=; path=/; max-age=0`;
};

// Token Management
export const setToken = (token: string) => {
    try {
        if (!isBrowser) return;
        setCookie(COOKIE_TOKEN_KEY, token, COOKIE_TOKEN_EXPIRED);
    } catch (error) {
        console.error('Error setting token:', error);
    }
};

export const setTokenAdmin = (token: string) => {
    try {
        if (!isBrowser) return;
        setCookie(COOKIE_TOKEN_KEY_ADMIN, token, COOKIE_TOKEN_EXPIRED);
    } catch (error) {
        console.error('Error setting admin token:', error);
    }
}

export const setTokenPharmacist = (token: string) => {
    try {
        if (!isBrowser) return;
        setCookie(COOKIE_TOKEN_KEY_PHARMACIST, token, COOKIE_TOKEN_EXPIRED);
    } catch (error) {
        console.error('Error setting pharmacist token:', error);
    }
}

export const getTokenAdmin = (): string | undefined => {
    try {
        if (!isBrowser) return undefined;
        return getCookie(COOKIE_TOKEN_KEY_ADMIN);
    } catch (error) {
        console.error('Error getting admin token:', error);
        return undefined;
    }
}
export const getTokenPharmacist = (): string | undefined => {
    try {
        if (!isBrowser) return undefined;
        return getCookie(COOKIE_TOKEN_KEY_PHARMACIST);
    } catch (error) {
        console.error('Error getting pharmacist token:', error);
        return undefined;
    }
}

export const getToken = (): string | undefined => {
    try {
        if (!isBrowser) return undefined;
        return getCookie(COOKIE_TOKEN_KEY);
    } catch (error) {
        console.error('Error getting token:', error);
        return undefined;
    }
};

export const removeToken = () => {
    try {
        if (!isBrowser) return;
        deleteCookie(COOKIE_TOKEN_KEY);
    } catch (error) {
        console.error('Error removing token:', error);
    }
}
export const removeTokenAdmin = () => {
    try {
        if (!isBrowser) return;
        deleteCookie(COOKIE_TOKEN_KEY_ADMIN);
    } catch (error) {
        console.error('Error removing admin token:', error);
    }
}

export const removeTokenPharmacist = () => {
    try {
        if (!isBrowser) return;
        deleteCookie(COOKIE_TOKEN_KEY_PHARMACIST);
    } catch (error) {
        console.error('Error removing pharmacist token:', error);
    }
}


// Session Management
export const setSession = (session: string) => {
    try {
        if (!isBrowser) return;
        setCookie(COOKIE_SESSION_KEY, session, COOKIE_SESSION_EXPIRED);
    } catch (error) {
        console.error('Error setting session:', error);
    }
};

export const getSession = (): string | undefined => {
    try {
        if (!isBrowser) return undefined;
        return getCookie(COOKIE_SESSION_KEY);
    } catch (error) {
        console.error('Error getting session:', error);
        return undefined;
    }
};

export const removeSession = () => {
    try {
        if (!isBrowser) return;
        deleteCookie(COOKIE_SESSION_KEY);
    } catch (error) {
        console.error('Error removing session:', error);
    }
};