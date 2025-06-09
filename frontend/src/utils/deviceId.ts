import {setCookie, getCookie, deleteCookie} from '@/utils/cookie';

/**
 * Device ID utility functions for generating and managing device identifiers
 */

// Updated key name as requested
const DEVICE_ID_KEY = 'x_dv_tk_id';
// Changed to 7 days as requested
const COOKIE_EXPIRY_DAYS = 7;

/**
 * Helper function to check if code is running in browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Generates a random string of specified length
 * @param length Length of the string to generate
 * @returns Random string
 */
function generateRandomString(length: number = 16): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

/**
 * Creates a fingerprint from browser data
 * @returns A string representing browser fingerprint components
 */
function createBrowserFingerprint(): string {
    if (!isBrowser) return '';

    const components = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        screen.width + 'x' + screen.height,
        navigator.platform
    ];

    return components.join('|');
}

/**
 * Generates a new device ID
 * @returns Newly generated device ID
 */
export function generateDeviceId(): string {
    const timestamp = Date.now().toString(36);
    const fingerprint = createBrowserFingerprint();
    const randomPart = generateRandomString(8);

    // Create hash-like ID from components
    const rawId = `${timestamp}-${fingerprint}-${randomPart}`;

    // Create a simple hash from the raw ID
    let hash = 0;
    for (let i = 0; i < rawId.length; i++) {
        const char = rawId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    // Format the final device ID
    const deviceId = `DEV-${Math.abs(hash).toString(16)}-${timestamp}-${randomPart}`;

    // Store the device ID only in cookies
    if (isBrowser) {
        try {
            // Store in cookies with 7-day expiration
            setCookie(DEVICE_ID_KEY, deviceId, COOKIE_EXPIRY_DAYS * 24 * 60 * 60); // 7 days in seconds
        } catch (e) {
            console.error('Failed to store device ID:', e);
        }
    }

    return deviceId;
}

/**
 * Gets the current device ID, or generates a new one if none exists
 * @returns Device ID string
 */
export function getDeviceId(): string {
    if (!isBrowser) return '';

    try {
        const deviceId = getCookie(DEVICE_ID_KEY);

        if (!deviceId) {
            return generateDeviceId();
        }

        return deviceId;
    } catch (e) {
        console.error('Error accessing device ID:', e);
        return `TEMP-${Date.now().toString(36)}`;
    }
}

/**
 * Forces regeneration of the device ID
 * @returns New device ID string
 */
export function regenerateDeviceId(): string {
    if (isBrowser) {
        try {
            deleteCookie(DEVICE_ID_KEY);
        } catch (e) {
            console.error('Failed to remove existing device ID:', e);
        }
    }

    return generateDeviceId();
}

/**
 * Checks if a device ID already exists
 * @returns Boolean indicating if device ID exists
 */
export function hasDeviceId(): boolean {
    if (!isBrowser) return false;

    try {
        // Check cookies only
        return !!getCookie(DEVICE_ID_KEY);
    } catch (e) {
        return false;
    }
}
