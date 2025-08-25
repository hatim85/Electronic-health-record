'use strict';

const fs = require('fs');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const { Wallets, Gateway } = require('fabric-network');

// Role → Org mapping
const roleToOrg = {
    hospital: 'Org1',
    diagnostics: 'Org1',
    doctor: 'Org1',
    pharmacy: 'Org1',
    patient: 'Org1',
    researcher: 'Org2',
    'insuranceAgent': 'Org2',
};

// Org → Admin identity mapping
const orgToAdminID = {
    Org1: 'hospitalAdmin',
    Org2: 'researchAdmin', // Default for Org2, overridden by enrollId where needed
};

/**
 * Register a user with the CA (with attrs) and create their on-ledger profile via chaincode.
 * @param {string|null} enrollId - Admin identity for CA registration and chaincode submission
 * @param {string} userID - The new user ID to register/enroll in CA and wallet
 * @param {string} userRole - One of keys in roleToOrg
 * @param {object} args - Extra attributes for chaincode
 */
const registerUser = async (enrollId, userID, userRole, args) => {
    const orgID = roleToOrg[userRole];
    if (!orgID) {
        throw new Error(`Invalid user role: ${userRole}. Please check roleToOrg mapping.`);
    }

    // Load CCP
    const ccpPath = path.resolve(
        __dirname,
        '..',
        'fabric-samples',
        'test-network',
        'organizations',
        'peerOrganizations',
        `${orgID}.example.com`.toLowerCase(),
        `connection-${orgID}.json`.toLowerCase()
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const orgMSP = ccp.organizations[orgID].mspid;

    // CA client
    const caOrg = ccp.organizations[orgID].certificateAuthorities[0];
    const caURL = ccp.certificateAuthorities[caOrg].url;
    const ca = new FabricCAServices(caURL);

    // Wallet
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check if identity exists
    let existing = await wallet.get(userID);
    if (existing) {
        console.log(`⚠️ Identity for ${userID} already exists. If it was created without attrs, delete it and re-run.`);
    } else {
        // Use admin identity for registration
        const adminID = enrollId || orgToAdminID[orgID];
        const adminIdentity = await wallet.get(adminID);
        if (!adminIdentity) {
            throw new Error(`Admin identity ${adminID} not found in wallet. Run enrollAdmin.js for ${orgID}`);
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, adminID);
        console.log(`Using admin identity: ${adminID} (${orgID})`);
        console.log(`Registering user ${userID} (${userRole}) in ${orgID}...`);

        // Register & enroll new user with attrs
        const secret = await ca.register(
            {
                affiliation: `${orgID.toLowerCase()}.department1`,
                enrollmentID: userID,
                role: 'client',
                attrs: [
                    { name: 'role', value: userRole, ecert: true },
                    { name: 'uuid', value: userID, ecert: true },
                ],
            },
            adminUser
        );

        const enrollment = await ca.enroll({
            enrollmentID: userID,
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
            mspId: orgMSP,
            type: 'X.509',
        };
        await wallet.put(userID, x509Identity);
        console.log(`✅ Registered & enrolled user ${userID} (${userRole}) into ${orgID}`);
    }

    // Decide submitter identity
    let submitterIdentity;
    if (['doctor', 'diagnostics', 'pharmacy', 'patient'].includes(userRole.toLowerCase())) {
        if (!args?.hospitalId) {
            throw new Error(`${userRole} registration requires args.hospitalId`);
        }
        submitterIdentity = args.hospitalId; // Hospital creates doctor, diagnostic center, or pharma
    } else if (userRole.toLowerCase() === 'researcher') {
        submitterIdentity = 'researchAdmin'; // researchAdmin for researchers
    } else if (userRole === 'insuranceAgent') {
        console.log('Registering insurance agent, using insuranceAdmin as submitter');
        submitterIdentity = 'insuranceAdmin'; // insuranceAdmin for insurance agents
    } else {
        submitterIdentity = userID; // Use userID for hospital, patient
    }

    // Sanity check
    const submitter = await wallet.get(submitterIdentity);
    if (!submitter) {
        throw new Error(`Submitter identity ${submitterIdentity} not found in wallet. Ensure it is enrolled.`);
    }

    console.log(
        `➡️ Submitting chaincode as ${submitterIdentity} for role=${userRole} (org=${orgID})`
    );

    // Connect gateway
    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: submitterIdentity,
        discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('ehrChainCode');

    let buffer;
    switch (userRole) {
        case 'patient':
            console.log(`Registering patient ${userID} with args: ${JSON.stringify(args)}`);
            buffer = await contract.submitTransaction(
                'registerPatient',
                JSON.stringify({
                    patientId: userID,
                    name: args.name,
                    dob: args.dob,
                    hospitalId: args.hospitalId,
                    city: args.city,
                })
            );
            break;

        case 'hospital':
            buffer = await contract.submitTransaction(
                'registerHospital',
                JSON.stringify({
                    hospitalId: userID,
                    hospitalName: args.hospitalName,
                    city: args.city,
                })
            );
            break;

        case 'doctor':
            buffer = await contract.submitTransaction(
                'createDoctor',
                JSON.stringify({
                    doctorId: userID,
                    name: args.name,
                    specialization: args.specialization,
                    hospitalId: args.hospitalId,
                    city: args.city,
                })
            );
            break;

        case 'diagnostics':
            buffer = await contract.submitTransaction(
                'createDiagnosticsCenter',
                JSON.stringify({
                    diagnosticsId: userID,
                    name: args.name,
                    city: args.city,
                })
            );
            break;

        case 'pharmacy':
            buffer = await contract.submitTransaction(
                'createPharmacy',
                JSON.stringify({
                    pharmacyId: userID,
                    name: args.name,
                    city: args.city,
                    hospitalId: args.hospitalId
                })
            );
            break;

        case 'researcher':
            buffer = await contract.submitTransaction(
                'onboardResearcher',
                JSON.stringify({
                    researcherId: userID,
                    name: args.name,
                    institution: args.institution
                })
            );
            break;

        case 'insuranceAgent':
            console.log('Creating insurance agent profile for user:', userID);
            console.log(`Args: ${JSON.stringify(args)}`);
            console.log('submitterIdentity:', submitterIdentity);
            buffer = await contract.submitTransaction(
                'onboardInsurance',
                JSON.stringify({
                    agentId: userID,
                    insuranceCompany: args.insuranceCompany,
                    name: args.name,
                    city: args.city,
                })
            );
            break;

        default:
            throw new Error(`Unhandled userRole: ${userRole}`);
    }

    gateway.disconnect();

    return {
        statusCode: 200,
        userID,
        role: userRole,
        submitter: submitterIdentity,
        message: `${userID} (${userRole}) registered and on-chain profile created in ${orgID}.`,
        chaincodeRes: buffer ? buffer.toString() : undefined,
    };
};

const login = async (userID, userRole) => {
    console.log(`Logging in user ${userID} with role ${userRole}...`);
    const orgID = roleToOrg[userRole];
    if (!orgID) throw new Error(`Invalid role: ${userRole}`);

    const ccpPath = path.resolve(
        __dirname,
        '..',
        'fabric-samples',
        'test-network',
        'organizations',
        'peerOrganizations',
        `${orgID}.example.com`.toLowerCase(),
        `connection-${orgID}.json`.toLowerCase()
    );
    JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet.get(userID);

    if (!identity) {
        return { statusCode: 200, message: `Identity for ${userID} not found.` };
    }

    return { statusCode: 200, userID, message: `Login successful for ${userID} (${userRole})` };
};

module.exports = { registerUser, login };