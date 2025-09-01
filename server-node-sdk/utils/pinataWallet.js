"use strict";

const axios = require('axios');
const { pinataClient } = require('./pinataClient');
const { encrypt, decrypt } = require('./crypto.js');

/**
 * Encrypts, prepares, and uploads an identity object to Pinata, tagging it with metadata.
 * @param {string} userId - The user ID to associate with the identity.
 * @param {object} identityObject - The user's X.509 identity object.
 * @param {string} userRole - The role of the user (doctor, hospital, patient, etc.)
 * @returns {Promise<string>} The unique Content Identifier (CID) of the stored object.
 */
async function storeIdentity(userId, identityObject, userRole) {
    try {
        // Include role directly in the identity object
        const identityWithRole = { ...identityObject, role: userRole };

        // Step 1: Serialize and encrypt
        const identityJsonString = JSON.stringify(identityWithRole);
        const encryptedPayload = encrypt(identityJsonString);

        // Step 2: Prepare data with searchable metadata
        const pinataData = {
            pinataContent: encryptedPayload,
            pinataMetadata: {
                name: `${userId}`,
                keyvalues: {
                    userId: userId,
                    role: userRole
                }
            }
        };

        // Step 3: Upload to Pinata
        const response = await pinataClient.post('/pinning/pinJSONToIPFS', pinataData);

        console.log(`✅ Identity for ${userId} stored successfully. CID: ${response.data.IpfsHash}`);
        return response.data.IpfsHash;

    } catch (error) {
        console.error(`Error storing identity for ${userId}:`, error.response ? error.response.data : error.message);
        throw new Error('Failed to store identity on Pinata.');
    }
}

/**
 * Queries Pinata's /data/pinList endpoint using metadata to find the CID for a given userId.
 * @param {string} userId - The user ID to search for.
 * @returns {Promise<string|null>} The CID if found, otherwise null.
 */
async function findCidByUserId(userId) {
    try {
        const metadataFilter = `?metadata[keyvalues]={"userId":{"value":"${userId}","op":"eq"}}`;
        const url = `/data/pinList${metadataFilter}`;
        const response = await pinataClient.get(url);

        if (response.data.rows && response.data.rows.length > 0) {
            return response.data.rows[0].ipfs_pin_hash;
        }
        return null;

    } catch (error) {
        console.error(`Error finding CID for ${userId}:`, error.response ? error.response.data : error.message);
        throw new Error('Failed to query Pinata for identity CID.');
    }
}

/**
 * Retrieves an identity from Pinata by first finding its CID via metadata, then fetching and decrypting it.
 * @param {string} userId - The user ID of the identity to retrieve.
 * @returns {Promise<object|null>} The decrypted identity object including role, or null if not found.
 */
async function retrieveIdentity(userId) {
    try {
        console.log(`Retrieving identity for user: ${userId}`);

        const cid = await findCidByUserId(userId);
        console.log(`Found CID for ${userId}: ${cid}`);
        if (!cid) return null;

        const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
        const response = await axios.get(gatewayUrl);
        console.log("response: ", response.data);

        const encryptedPayload = response.data;
        const decryptedJsonString = decrypt(encryptedPayload);
        const identityObject = JSON.parse(decryptedJsonString);

        console.log(`✅ Successfully retrieved and decrypted identity for ${userId}`);
        return identityObject; // identityObject.role is now directly available

    } catch (error) {
        console.error(`Failed to retrieve or decrypt identity for ${userId}:`, error);
        return null;
    }
}

module.exports = { storeIdentity, retrieveIdentity, findCidByUserId };
