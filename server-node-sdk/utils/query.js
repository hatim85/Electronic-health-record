'use strict';

const { Gateway } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const PinataWallet = require('./pinataWallet.js'); // Import the new wallet handler

const getQuery = async (fcn, args, userId,orgID) => {
    const ccpPath = path.resolve(__dirname, '../..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', `${orgID}.example.com`.toLowerCase(), `connection-${orgID}.json`.toLowerCase());
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    console.log(`Using userId: ${userId} for query`);
    console.log(`Function to call: ${fcn} with args: ${JSON.stringify(args)}`);

    // Retrieve identity directly from Pinata
    const identity = await PinataWallet.retrieveIdentity(userId);
    if (!identity) {
        console.log(`An identity for the user ${userId} does not exist on Pinata.`);
        return {
            statusCode: 404,
            status: false,
            message: `An identity for the user ${userId} does not exist.`
        };
    }

    const gateway = new Gateway();
    // Connect using the retrieved identity object
    await gateway.connect(ccp, { 
        identity: identity, 
        discovery: { enabled: true, asLocalhost: true } 
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('ehrChainCode');

    let result = await contract.evaluateTransaction(fcn, JSON.stringify(args));
    result = JSON.parse(result.toString());

    console.log(`Response from ${fcn} chaincode :: `, result);

    gateway.disconnect();
    
    return result;
}

module.exports = { getQuery };