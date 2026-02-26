import { get, save } from "./storage.js";
import { encrypt, decrypt } from "./encryption.js";


export const getExpiry = async (expiryName) => {
    const encrypted = await get(expiryName);
    return encrypted ? decrypt(encrypted) : null;
}

export const saveExpiry = async (expiryName, expiry) => {
    const encrypted = encrypt(expiry);
    return save(expiryName, encrypted);
}
