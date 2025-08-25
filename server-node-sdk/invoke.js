'use strict';

const fs = require('fs');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

// Role → Org mapping
const roleToOrg = {
    hospital: 'Org1',
    diagnostics: 'Org1',
    doctor: 'Org1',
    pharmacy: 'Org1',
    patient: 'Org1',
    researcher: 'Org2',
    insuranceAdmin: 'Org2',
    insuranceAgent: 'Org2'
};

const invokeTransaction = async (fcn, args, userID, userRole) => {
    console.log("Invoke args:", JSON.stringify(args));
    console.log("User ID:", userID);
    console.log("User Role:", userRole);

    const orgID = roleToOrg[userRole];
    if (!orgID) throw new Error(`Invalid userRole: ${userRole}`);

    const channelName = 'mychannel';
    const chaincodeName = 'ehrChainCode';

    const ccpPath = path.resolve(
        __dirname, '..', 'fabric-samples', 'test-network',
        'organizations', 'peerOrganizations',
        `${orgID}.example.com`.toLowerCase(),
        `connection-${orgID}.json`.toLowerCase()
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const identity = await wallet.get(userID);
    if (!identity) {
        return { statusCode: 200, status: false, message: `Identity for ${userID} not found in wallet` };
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userID, discovery: { enabled: true, asLocalhost: true } });
    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);

    console.log("Invoke args:", JSON.stringify(args));
    let result = await contract.submitTransaction(fcn, JSON.stringify(args));
    result = JSON.parse(result);

    console.log(`Response from ${fcn}:`, result);
    gateway.disconnect();

    return result;
};

module.exports = { invokeTransaction };
