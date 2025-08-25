/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-License: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');

async function main() {
    try {
        // Load the network configuration
        const ccpPath = path.resolve(__dirname, '../..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client
        const caInfo = ccp.certificateAuthorities['ca.org2.example.com'];
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caInfo.tlsCACerts.pem, verify: false }, caInfo.caName);

        // Create a new wallet
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check if insuranceAdmin already exists
        const identity = await wallet.get('insuranceAdmin');
        if (identity) {
            console.log('An identity for the admin user "insuranceAdmin" already exists in the wallet');
            return;
        }

        // Enroll the default CA admin (not saved to wallet)
        const adminEnrollment = await ca.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw',
            attr_reqs: [
                { name: 'role', optional: true },
                { name: 'uuid', optional: true },
            ],
        });

        // Build admin user context without saving to wallet
        const adminX509Identity = {
            credentials: {
                certificate: adminEnrollment.certificate,
                privateKey: adminEnrollment.key.toBytes(),
            },
            mspId: 'Org2MSP',
            type: 'X.509',
        };
        const provider = wallet.getProviderRegistry().getProvider(adminX509Identity.type);
        const adminUser = await provider.getUserContext(adminX509Identity, 'admin');

        // Register insuranceAdmin with attributes
        const secret = await ca.register({
            affiliation: 'org2.department1',
            enrollmentID: 'insuranceAdmin',
            role: 'client',
            attrs: [
                { name: 'hf.Registrar.Roles', value: 'client', ecert: true },
                { name: 'hf.Registrar.Attributes', value: 'role,uuid', ecert: true },
                { name: 'hf.AffiliationMgr', value: 'true', ecert: true },
                { name: 'role', value: 'insuranceAdmin', ecert: true },
                { name: 'uuid', value: 'insuranceAdmin', ecert: true },
            ],
        }, adminUser);

        // Enroll insuranceAdmin
        const enrollment = await ca.enroll({
            enrollmentID: 'insuranceAdmin',
            enrollmentSecret: secret,
            attr_reqs: [
                { name: 'role', optional: false },
                { name: 'uuid', optional: false },
            ],
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org2MSP',
            type: 'X.509',
        };
        await wallet.put('insuranceAdmin', x509Identity);
        console.log('Successfully registered and enrolled admin user "insuranceAdmin" and imported it into the wallet');
    } catch (error) {
        console.error(`Failed to enroll admin user "insuranceAdmin": ${error}`);
        process.exit(1);
    }
}

main();