"use strict";

const axios = require('axios'); // ⬅️ FIX #1: Added the missing axios import
const { pinataClient } = require('./pinataClient'); // Assumes you have this configured
const { encrypt, decrypt } = require('./crypto.js'); // Assumes crypto functions are in this file

/**
 * Encrypts, prepares, and uploads an identity object to Pinata, tagging it with metadata.
 * @param {string} userId - The user ID to associate with the identity.
 * @param {object} identityObject - The user's X.509 identity object.
 * @returns {Promise<string>} The unique Content Identifier (CID) of the stored object.
 */
async function storeIdentity(userId, identityObject) {
    try {
        // Step 1: Serialize and Encrypt
        const identityJsonString = JSON.stringify(identityObject);
        const encryptedPayload = encrypt(identityJsonString);

        // Step 2: Prepare data with searchable metadata
        const pinataData = {
            pinataContent: encryptedPayload,
            pinataMetadata: {
                name: `${userId}`,
                keyvalues: {
                    // This userId key is how we will find the identity later
                    userId: userId
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
            // ⬇️ FIX #2: Correctly access the ipfs_pin_hash from the first item in the rows array
            return response.data.rows[0].ipfs_pin_hash;
        }
        return null; // No identity found for this user

    } catch (error)
 {
        console.error(`Error finding CID for ${userId}:`, error.response ? error.response.data : error.message);
        throw new Error('Failed to query Pinata for identity CID.');
    }
}

/**
 * Retrieves an identity from Pinata by first finding its CID via metadata, then fetching and decrypting it.
 * @param {string} userId - The user ID of the identity to retrieve.
 * @returns {Promise<object|null>} The decrypted identity object, or null if not found.
 */
async function retrieveIdentity(userId) {
    try {
        console.log(`Retrieving identity for user: ${userId}`);
        
        // Step 1: Find the CID using our metadata query function
        const cid = await findCidByUserId(userId);
        console.log(`Found CID for ${userId}: ${cid}`);
        
        if (!cid) {
            return null;
        }

        // Step 2: Fetch the encrypted data from the IPFS gateway
        const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
        const response = await axios.get(gatewayUrl);
        // The encrypted payload is nested inside the 'pinataContent' object
        const encryptedPayload = response.data;

        // Step 3: Decrypt and deserialize
        const decryptedJsonString = decrypt(encryptedPayload);
        const identityObject = JSON.parse(decryptedJsonString);
        
        console.log(`✅ Successfully retrieved and decrypted identity for ${userId}`);
        return identityObject;

    } catch (error) {
        console.error(`Failed to retrieve or decrypt identity for ${userId}:`, error);
        return null;
    }
}

module.exports = { storeIdentity, retrieveIdentity, findCidByUserId };