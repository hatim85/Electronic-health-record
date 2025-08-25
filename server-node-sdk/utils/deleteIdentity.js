// utils/deleteIdentity.js
const path = require('path');
const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');

const ccpPath = path.resolve(__dirname, '../..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));



async function deleteIdentity(userId) {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Load CA info
    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    const ca = new FabricCAServices(caInfo.url);

    // Get admin identity
    const adminIdentity = await wallet.get('hospitalAdmin');
    if (!adminIdentity) {
        throw new Error('❌ Admin identity "hospitalAdmin" not found in wallet');
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'hospitalAdmin');

    // Step 1: Revoke identity from CA
    try {
        await ca.revoke({ enrollmentID: userId }, adminUser);
        console.log(`✅ Identity ${userId} revoked at CA`);
    } catch (revokeErr) {
        console.warn(`⚠️ Failed to revoke identity ${userId} at CA: ${revokeErr.message}`);
    }

    // Step 2: Remove from wallet
    const identity = await wallet.get(userId);
    if (identity) {
        await wallet.remove(userId);
        console.log(`✅ Identity ${userId} removed from wallet`);
    } else {
        console.log(`ℹ️ No wallet identity found for ${userId}`);
    }
}

module.exports = { deleteIdentity };
