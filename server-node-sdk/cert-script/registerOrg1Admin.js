// /*
//  * Copyright IBM Corp. All Rights Reserved.
//  *
//  * SPDX-License-Identifier: Apache-2.0
//  */

// 'use strict';

// const FabricCAServices = require('fabric-ca-client');
// const { Wallets } = require('fabric-network');
// const fs = require('fs');
// const path = require('path');

// async function main() {
//     try {
//         // load the network configuration
//         const ccpPath = path.resolve(__dirname, '../..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
//         const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

//         // Create a new CA client for interacting with the CA.
//         const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
//         const caTLSCACerts = caInfo.tlsCACerts.pem;
//         const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

//         // Create a new file system based wallet for managing identities.
//         const walletPath = path.join(process.cwd(), 'wallet');
//         const wallet = await Wallets.newFileSystemWallet(walletPath);
//         console.log(`Wallet path: ${walletPath}`);

//         // Check to see if we've already enrolled the admin user.
//         const identity = await wallet.get('hospitalAdmin');
//         if (identity) {
//             console.log('An identity for the admin user "admin" already exists in the wallet');
//             return;
//         }

//         // Enroll the admin user, and import the new identity into the wallet.
//         const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
//         const x509Identity = {
//             credentials: {
//                 certificate: enrollment.certificate,
//                 privateKey: enrollment.key.toBytes(),
//             },
//             mspId: 'Org1MSP',
//             type: 'X.509',
//         };
//         await wallet.put('hospitalAdmin', x509Identity);
//         console.log('Successfully enrolled admin user "admin1" and imported it into the wallet');

//     } catch (error) {
//         console.error(`Failed to enroll admin user "admin1": ${error}`);
//         process.exit(1);
//     }
// }

// main();

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // Load Org1 connection profile
        const ccpPath = path.resolve(
            __dirname,
            '../..',
            'fabric-samples',
            'test-network',
            'organizations',
            'peerOrganizations',
            'org1.example.com',
            'connection-org1.json'
        );
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(
            caInfo.url,
            { trustedRoots: caTLSCACerts, verify: false },
            caInfo.caName
        );

        // Wallet for storing hospitalAdmin
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check if hospitalAdmin already exists
        const userIdentity = await wallet.get('hospitalAdmin');
        if (userIdentity) {
            console.log('✅ "hospitalAdmin" already exists in the wallet');
            return;
        }

        // 1️⃣ Enroll bootstrap admin (in-memory only)
        const enrollment = await ca.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw'
        });
        const adminIdentity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // 2️⃣ Register hospitalAdmin
        const secret = await ca.register(
            {
                affiliation: 'org1.department1',
                enrollmentID: 'hospitalAdmin',
                role: 'client',
                attrs: [
                    { name: 'role', value: 'hospitalAdmin', ecert: true },
                    { name: 'uuid', value: 'hospitalAdmin', ecert: true },
                    { name: 'hf.Registrar.Roles', value: 'client,user,hospital,doctor,insuranceAdmin', ecert: true },
                    { name: 'hf.Registrar.Attributes', value: '*', ecert: true },
                    { name: 'hf.Revoker', value: 'true', ecert: true }
                ],
            },
            adminUser // <-- bootstrap admin
        );


        // 3️⃣ Enroll hospitalAdmin
        const hospEnrollment = await ca.enroll({
            enrollmentID: 'hospitalAdmin',
            enrollmentSecret: secret,
        });

        const hospitalAdminIdentity = {
            credentials: {
                certificate: hospEnrollment.certificate,
                privateKey: hospEnrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        // Save ONLY hospitalAdmin in wallet
        await wallet.put('hospitalAdmin', hospitalAdminIdentity);

        console.log('✅ Successfully registered & enrolled "hospitalAdmin" into the wallet');

    } catch (error) {
        console.error(`❌ Failed to enroll hospitalAdmin: ${error}`);
        process.exit(1);
    }
}

main();
