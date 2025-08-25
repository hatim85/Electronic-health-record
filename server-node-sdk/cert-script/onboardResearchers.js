/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // Researchers sit in Org2 in your mapping
        const ccpPath = path.resolve(__dirname, '../..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const caURL = ccp.certificateAuthorities['ca.org2.example.com'].url;
        const ca = new FabricCAServices(caURL);

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const userId = 'Researcher-01';

        const userIdentity = await wallet.get(userId);
        if (userIdentity) {
            console.log(`An identity for the user "${userId}" already exists in the wallet`);
            return;
        }

        // ensure researchAdmin exists in wallet (you must have created it earlier)
        const adminIdentity = await wallet.get('researchAdmin');
        if (!adminIdentity) {
            console.log('researchAdmin identity not found in wallet. Run onboardResearchAdmin for Org2 first.');
            return;
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'researchAdmin');

        const secret = await ca.register({
            affiliation: 'org2.department1',
            enrollmentID: userId,
            role: 'client',
            attrs: [
                { name: 'role', value: 'researcher', ecert: true },
                { name: 'uuid', value: userId, ecert: true }
            ]
        }, adminUser);

        const enrollment = await ca.enroll({
            enrollmentID: userId,
            enrollmentSecret: secret,
            attr_reqs: [
                { name: 'role', optional: false },
                { name: 'uuid', optional: false }
            ]
        });

        const x509Identity = {
            credentials: { certificate: enrollment.certificate, privateKey: enrollment.key.toBytes() },
            mspId: 'Org2MSP',
            type: 'X.509'
        };
        await wallet.put(userId, x509Identity);
        console.log(`Successfully registered and enrolled ${userId} into the wallet`);

        // submit on-chain onboarding via research admin or any researchAdmin-capable identity
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'researchAdmin', discovery: { enabled: true, asLocalhost: true } });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('ehrChainCode');

        const args = {
            researcherId: userId,
            name: 'Research Lab 01',
            institution: 'Research Institute'
        };

        const res = await contract.submitTransaction('onboardResearcher', JSON.stringify(args));
        console.log('onboardResearcher tx result:', res.toString());

        gateway.disconnect();

    } catch (error) {
        console.error(`Failed to register Researcher: ${error}`);
        process.exit(1);
    }
}

main();
