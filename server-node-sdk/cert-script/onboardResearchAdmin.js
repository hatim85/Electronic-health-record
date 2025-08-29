// /*
//  * Copyright IBM Corp. All Rights Reserved.
//  *
//  * SPDX-License-Identifier: Apache-2.0
//  */

// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const FabricCAServices = require('fabric-ca-client');
// const { Wallets } = require('fabric-network');
// // ⬇️ Import the Pinata wallet helper
// const PinataWallet = require('../pinataWallet.js');

// async function main() {
//     try {
//         // Load the network configuration for Org2
//         const ccpPath = path.resolve(__dirname, '../..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
//         const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

//         // Create a new CA client for Org2
//         const caInfo = ccp.certificateAuthorities['ca.org2.example.com'];
//         const ca = new FabricCAServices(caInfo.url, { trustedRoots: caInfo.tlsCACerts.pem, verify: false }, caInfo.caName);

//         // Check if researchAdmin already exists on Pinata
//         const identity = await PinataWallet.retrieveIdentity('researchAdmin');
//         if (identity) {
//             console.log('✅ An identity for the admin user "researchAdmin" already exists on Pinata.');
//             return;
//         }

//         // Use a temporary in-memory wallet for the bootstrap admin
//         const tempWallet = await Wallets.newInMemoryWallet();

//         // Enroll the default CA admin (not saved to Pinata)
//         const adminEnrollment = await ca.enroll({
//             enrollmentID: 'admin',
//             enrollmentSecret: 'adminpw',
//         });

//         // Build admin user context
//         const adminX509Identity = {
//             credentials: {
//                 certificate: adminEnrollment.certificate,
//                 privateKey: adminEnrollment.key.toBytes(),
//             },
//             mspId: 'Org2MSP',
//             type: 'X.509',
//         };
//         await tempWallet.put('admin', adminX509Identity); // Store temporarily

//         const provider = tempWallet.getProviderRegistry().getProvider(adminX509Identity.type);
//         const adminUser = await provider.getUserContext(adminX509Identity, 'admin');

//         // Register researchAdmin with attributes
//         const secret = await ca.register({
//             affiliation: 'org2.department1',
//             enrollmentID: 'researchAdmin',
//             role: 'client',
//             attrs: [
//                 { name: 'hf.Registrar.Roles', value: 'client', ecert: true },
//                 { name: 'hf.Registrar.Attributes', value: 'role,uuid', ecert: true },
//                 { name: 'hf.AffiliationMgr', value: 'true', ecert: true },
//                 { name: 'role', value: 'researchAdmin', ecert: true },
//                 { name: 'uuid', value: 'researchAdmin', ecert: true },
//             ],
//         }, adminUser);

//         // Enroll researchAdmin
//         const enrollment = await ca.enroll({
//             enrollmentID: 'researchAdmin',
//             enrollmentSecret: secret,
//             attr_reqs: [
//                 { name: 'role', optional: false },
//                 { name: 'uuid', optional: false },
//             ],
//         });

//         const x509Identity = {
//             credentials: {
//                 certificate: enrollment.certificate,
//                 privateKey: enrollment.key.toBytes(),
//             },
//             mspId: 'Org2MSP',
//             type: 'X.509',
//         };
        
//         // ⬇️ Store the final researchAdmin identity on Pinata IPFS
//         await PinataWallet.storeIdentity('researchAdmin', x509Identity);
//         console.log('✅ Successfully registered and enrolled admin user "researchAdmin" and stored its identity on Pinata IPFS.');
        
//     } catch (error) {
//         console.error(`❌ Failed to enroll admin user "researchAdmin": ${error}`);
//         process.exit(1);
//     }
// }

// main();


/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');

// ⬇️ Import the necessary functions from your Pinata helpers
const { storeIdentity, findCidByUserId } = require('../pinataWallet.js'); // Adjust path if needed
const { pinataClient } = require('../pinataClient.js'); // Adjust path if needed

const ADMIN_ID = 'researchAdmin';

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

        // Load the network configuration for Org2
        const ccpPath = path.resolve(__dirname, '../..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for Org2
        const caInfo = ccp.certificateAuthorities['ca.org2.example.com'];
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caInfo.tlsCACerts.pem, verify: false }, caInfo.caName);

        // Use a temporary in-memory wallet for the bootstrap admin
        const tempWallet = await Wallets.newInMemoryWallet();
        const adminEnrollment = await ca.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw',
        });

        // Build admin user context
        const adminX509Identity = {
            credentials: {
                certificate: adminEnrollment.certificate,
                privateKey: adminEnrollment.key.toBytes(),
            },
            mspId: 'Org2MSP',
            type: 'X.509',
        };
        await tempWallet.put('admin', adminX509Identity);

        const provider = tempWallet.getProviderRegistry().getProvider(adminX509Identity.type);
        const adminUser = await provider.getUserContext(adminX509Identity, 'admin');

        // Register researchAdmin with attributes
        const secret = await ca.register({
            affiliation: 'org2.department1',
            enrollmentID: ADMIN_ID,
            role: 'client',
            attrs: [
                { name: 'hf.Registrar.Roles', value: 'client', ecert: true },
                { name: 'hf.Registrar.Attributes', value: 'role,uuid', ecert: true },
                { name: 'hf.AffiliationMgr', value: 'true', ecert: true },
                { name: 'role', value: ADMIN_ID, ecert: true },
                { name: 'uuid', value: ADMIN_ID, ecert: true },
            ],
        }, adminUser);

        // Enroll researchAdmin
        const enrollment = await ca.enroll({
            enrollmentID: ADMIN_ID,
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
        
        // --- 3. STORE THE NEW IDENTITY ---
        await storeIdentity(ADMIN_ID, x509Identity);
        console.log(`\n--- ✅ Successfully created and stored a fresh identity for ${ADMIN_ID} ---`);
        
    } catch (error) {
        console.error(`❌ Failed to enroll admin user "${ADMIN_ID}": ${error}`);
        process.exit(1);
    }
}

main();