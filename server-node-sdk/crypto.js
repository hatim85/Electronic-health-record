"use strict";

const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

const masterKey = Buffer.from(process.env.WALLET_ENCRYPTION_KEY, 'hex');

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv);
    
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    const authTag = cipher.getAuthTag();

    return {
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        encryptedData: encrypted.toString('base64')
    };
}

function decrypt(encryptedPayload) {
    const iv = Buffer.from(encryptedPayload.iv, 'base64');
    const authTag = Buffer.from(encryptedPayload.authTag, 'base64');
    const encryptedData = Buffer.from(encryptedPayload.encryptedData, 'base64');

    const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };