/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// ⬇️ Import the necessary functions from your Pinata helpers
const { storeIdentity, findCidByUserId } = require('../utils/pinataWallet.js'); // Adjust path if needed
const { pinataClient } = require('../utils/pinataClient.js'); // Adjust path if needed

const ADMIN_ID = 'superAdmin';

async function main() {
    try {
        console.log(`--- Starting registration process for ${ADMIN_ID} ---`);

        // --- 1. CLEANUP STALE PINS ---
        // This new logic replaces the simple "check and exit" block.
        console.log(`Searching for any existing pins for ${ADMIN_ID} to clean up...`);
        const existingCid = await findCidByUserId(ADMIN_ID);

        if (existingCid) {
            console.log(`Found existing or stale record with CID: ${existingCid}.`);
            console.log(`Attempting to unpin it now...`);
            try {
                // Directly call the Pinata API to delete the old pin
                await pinataClient.delete(`/pinning/unpin/${existingCid}`);
                console.log(`✅ Successfully unpinned stale record.`);
            } catch (error) {
                // This is expected if the pin is a "ghost" record. We can safely ignore it and continue.
                console.warn(`⚠️ Could not unpin stale record (this is OK if it was already deleted). Continuing...`);
            }
        } else {
            console.log('No existing records found. Proceeding with fresh registration.');
        }

        // --- 2. PROCEED WITH REGISTRATION ---
        console.log(`\nRegistering a new identity for ${ADMIN_ID}...`);

        const ccpPath = path.resolve(__dirname, '../..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caInfo.tlsCACerts.pem, verify: false }, caInfo.caName);

        const tempWallet = await Wallets.newInMemoryWallet();
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });

        const adminIdentity = {
            credentials: { certificate: enrollment.certificate, privateKey: enrollment.key.toBytes() },
            mspId: 'Org1MSP', type: 'X.509',
        };
        await tempWallet.put('admin', adminIdentity);

        const provider = tempWallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: ADMIN_ID,
            role: 'client',
            attrs: [
                { name: 'role', value: ADMIN_ID, ecert: true },
                { name: 'uuid', value: ADMIN_ID, ecert: true },
                { name: 'hf.Registrar.Roles', value: 'client,user,hospital,doctor,insuranceAdmin', ecert: true },
                { name: 'hf.Registrar.Attributes', value: '*', ecert: true },
                { name: 'hf.Revoker', value: 'true', ecert: true }
            ],
        }, adminUser);

        const hospEnrollment = await ca.enroll({ enrollmentID: ADMIN_ID, enrollmentSecret: secret });

        const superAdminIdentity = {
            credentials: { certificate: hospEnrollment.certificate, privateKey: hospEnrollment.key.toBytes() },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        // --- 3. STORE THE NEW IDENTITY ---
        await storeIdentity(ADMIN_ID, superAdminIdentity, 'superAdmin');

        console.log(`\n--- ✅ Successfully created and stored a fresh identity for ${ADMIN_ID} ---`);

    } catch (error) {
        console.error(`❌ Failed to enroll ${ADMIN_ID}: ${error}`);
        process.exit(1);
    }
}

main();