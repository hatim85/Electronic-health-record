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
        const ccpPath = path.resolve(__dirname, '../..', 'fabric-samples', 'test-network',
            'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const userId = 'DiagnosticsCenter01';

        // skip if already exists
        const userIdentity = await wallet.get(userId);
        if (userIdentity) {
            console.log(`An identity for the user "${userId}" already exists in the wallet`);
            return;
        }

        // make sure hospitalAdmin (or org admin) exists in wallet
        const adminIdentity = await wallet.get('hospitalAdmin');
        if (!adminIdentity) {
            console.log('hospitalAdmin identity not found in wallet. Run enrollAdmin first.');
            return;
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'hospitalAdmin');

        // Register + enroll
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: userId,
            role: 'client',
            attrs: [
                { name: 'role', value: 'diagnostics', ecert: true },
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
            mspId: 'Org1MSP',
            type: 'X.509'
        };

        await wallet.put(userId, x509Identity);
        console.log(`Successfully registered and enrolled ${userId} and imported into the wallet`);

        // Optionally submit an on-chain onboarding transaction so ledger has a diagnostics entry.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'Hospital01', discovery: { enabled: true, asLocalhost: true } });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('ehrChainCode');

        const args = {
            diagnosticsId: userId,
            name: 'Diagnostics Center 01',
            city: 'Pune'
        };

        // this assumes ehrChainCode has onboardDiagnostics (we'll add it)
        const res = await contract.submitTransaction('createDiagnosticsCenter', JSON.stringify(args));
        console.log('onboardDiagnostics tx result:', res.toString());

        gateway.disconnect();

    } catch (error) {
        console.error(`Failed to register DiagnosticsCenter: ${error}`);
        process.exit(1);
    }
}

main();
