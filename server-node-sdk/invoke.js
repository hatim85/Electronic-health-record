'use strict';

const fs = require('fs');
const path = require('path');
const { Gateway } = require('fabric-network');
const PinataWallet = require('./pinataWallet.js'); // Import the new wallet handler

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

    const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', `${orgID}.example.com`.toLowerCase(), `connection-${orgID}.json`.toLowerCase());
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Retrieve identity directly from Pinata
    const identity = await PinataWallet.retrieveIdentity(userID);
    if (!identity) {
        return { statusCode: 404, status: false, message: `Identity for ${userID} not found on Pinata` };
    }

    const gateway = new Gateway();
    // Connect using the retrieved identity object, no wallet object needed
    await gateway.connect(ccp, { 
        identity: identity, 
        discovery: { enabled: true, asLocalhost: true } 
    });
    
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('ehrChainCode');

    let result = await contract.submitTransaction(fcn, JSON.stringify(args));
    result = JSON.parse(result.toString());

    console.log(`Response from ${fcn}:`, result);
    gateway.disconnect();

    return result;
};

module.exports = { invokeTransaction };