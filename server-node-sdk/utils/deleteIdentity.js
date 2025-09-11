// utils/deleteIdentity.js
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const { pinataClient } = require('./pinataClient');
const { findCidByUserId, retrieveIdentity } = require('./pinataWallet');

// Load connection profile
const ccpPath = path.resolve(__dirname, '../..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

/**
 * Delete identity from CA and Pinata (IPFS).
 * Only allows if userRole is 'hospital'.
 * @param {string} userId
 * @param {string} userRole
 */
async function deleteIdentity(userId, userRole, hospitalId) {
    if (userRole !== 'hospital') {
        throw new Error('❌ Only hospital role can delete identities.');
    }

    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    const ca = new FabricCAServices(caInfo.url);

    // Retrieve hospital identity from Pinata and use as registrar
    const hospitalIdentity = await retrieveIdentity(hospitalId);
    if (!hospitalIdentity) {
        throw new Error(`Hospital identity '${hospitalId}' not found on Pinata.`);
    }
    const tempWallet = await Wallets.newInMemoryWallet();
    await tempWallet.put(hospitalId, hospitalIdentity);
    const provider = tempWallet.getProviderRegistry().getProvider(hospitalIdentity.type);
    const hospitalUser = await provider.getUserContext(hospitalIdentity, hospitalId);

    try {
        await ca.revoke({ enrollmentID: userId }, hospitalUser);
        console.log(`✅ Identity ${userId} revoked at CA`);
    } catch (revokeErr) {
        console.warn(`⚠️ Failed to revoke identity ${userId} at CA: ${revokeErr.message}`);
    }

    // Step 2: Remove from Pinata (IPFS)
    try {
        const cid = await findCidByUserId(userId);
        if (cid) {
            await pinataClient.delete(`/pinning/unpin/${cid}`);
            console.log(`✅ Identity ${userId} (CID: ${cid}) unpinned from Pinata`);
        } else {
            console.log(`ℹ️ No Pinata CID found for ${userId}`);
        }
    } catch (pinataErr) {
        console.warn(`⚠️ Failed to unpin identity for ${userId} from Pinata: ${pinataErr.message}`);
    }
}

module.exports = { deleteIdentity };