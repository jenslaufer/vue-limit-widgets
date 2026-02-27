import { get, save } from './storage.js'
import { encrypt, decrypt } from './encryption.js'

const quotaLocks = new Map()

const withQuotaLock = async (quotaName, fn) => {
    const previous = quotaLocks.get(quotaName) ?? Promise.resolve()
    let release
    const current = new Promise((resolve) => {
        release = resolve
    })

    quotaLocks.set(quotaName, previous.then(() => current))

    await previous
    try {
        return await fn()
    } finally {
        release()
        if (quotaLocks.get(quotaName) === current) {
            quotaLocks.delete(quotaName)
        }
    }
}

export const getQuotaUsed = async (quotaName) => {
    const encrypted = await get(quotaName)
    return encrypted ? decrypt(encrypted) : null
}

export const saveQuotaUsed = async (quotaName, used) => {
    const encrypted = encrypt(used)
    return save(quotaName, encrypted)
}

export const incrementQuotaUsed = async (quotaName, maxQuota) => {
    return withQuotaLock(quotaName, async () => {
        const currentQuotaUsed = Number(await getQuotaUsed(quotaName) ?? 0)
        const limit = Number(maxQuota)
        const nextQuotaUsed = currentQuotaUsed <= limit
            ? currentQuotaUsed + 1
            : currentQuotaUsed

        await saveQuotaUsed(quotaName, nextQuotaUsed)
        return nextQuotaUsed
    })
}

export const getMaxQuota = async (maxQuotaName) => {
    const encrypted = await get(maxQuotaName)
    return encrypted ? decrypt(encrypted) : null
}

export const saveMaxQuota = async (maxQuotaName, maxQuota) => {
    const encrypted = encrypt(maxQuota)
    return save(maxQuotaName, encrypted)
}
