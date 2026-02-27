const getExtensionStorage = () => {
    if (typeof chrome === 'undefined') {
        return null
    }

    return chrome.storage?.local ?? null
}

const getBrowserStorage = () => {
    if (typeof globalThis === 'undefined') {
        return null
    }

    try {
        const storage = globalThis.localStorage
        if (!storage || typeof storage.getItem !== 'function') {
            return null
        }
        return storage
    } catch {
        return null
    }
}

/**
 * Get value by key
 */
export const get = async (key) => {
    const extensionStorage = getExtensionStorage()
    if (extensionStorage) {
        const result = await extensionStorage.get(key)
        return result[key] ?? null
    }

    const browserStorage = getBrowserStorage()
    if (browserStorage) {
        const raw = browserStorage.getItem(key)
        if (raw === null) {
            return null
        }

        try {
            return JSON.parse(raw)
        } catch {
            return null
        }
    }

    throw new Error('No supported storage backend available')
}

/**
 * Save value by key
 */
export const save = async (key, value) => {
    const extensionStorage = getExtensionStorage()
    if (extensionStorage) {
        await extensionStorage.set({ [key]: value })
        return
    }

    const browserStorage = getBrowserStorage()
    if (browserStorage) {
        browserStorage.setItem(key, JSON.stringify(value))
        return
    }

    throw new Error('No supported storage backend available')
}
