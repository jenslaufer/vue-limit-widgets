import { get, save } from "./storage.js";
import { encrypt, decrypt } from "./encryption.js";

export const getQuotaUsed = async (quotaName) => {
    const encrypted = await get(quotaName);
    return encrypted ? decrypt(encrypted) : null;
}

export const saveQuotaUsed = async (quotaName, used) => {
    const encrypted = encrypt(used);
    return save(quotaName, encrypted);
}

export const getMaxQuota = async (maxQuotaName) => {
    const encrypted = await get(maxQuotaName);
    return encrypted ? decrypt(encrypted) : null;
}

export const saveMaxQuota = async (maxQuotaName, maxQuota) => {
    const encrypted = encrypt(maxQuota);
    return save(maxQuotaName, encrypted);
}
