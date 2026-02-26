const isExtensionStorage =
    typeof chrome !== "undefined" &&
    chrome.storage?.local;

const isBrowserStorage =
    typeof globalThis !== "undefined" &&
    globalThis.localStorage &&
    typeof globalThis.localStorage === "object";

/**
 * Get value by key
 */
export const get = async (key) => {
    // Chrome / Firefox Extension
    if (isExtensionStorage) {
        const result = await chrome.storage.local.get(key);
        return result[key] ?? null;
    }

    // Normal Browser
    if (isBrowserStorage) {
        const raw = localStorage.getItem(key);
        return raw === null ? null : JSON.parse(raw);
    }

    throw new Error("No supported storage backend available");
};

/**
 * Save value by key
 */
export const save = async (key, value) => {
    // Chrome / Firefox Extension
    if (isExtensionStorage) {
        await chrome.storage.local.set({ [key]: value });
        return;
    }

    // Normal Browser
    if (isBrowserStorage) {
        localStorage.setItem(key, JSON.stringify(value));
        return;
    }

    throw new Error("No supported storage backend available");
};
