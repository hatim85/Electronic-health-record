"use strict";

const fs = require("fs");
const path = require("path");
const FabricCAServices = require("fabric-ca-client");
const { Wallets, Gateway } = require("fabric-network");
const PinataWallet = require('./pinataWallet.js'); // Import the new wallet handler

// Role → Org mapping (remains the same)
const roleToOrg = {
  hospitalAdmin: "Org1",
  hospital: "Org1",
  diagnostics: "Org1",
  doctor: "Org1",
  pharmacy: "Org1",
  patient: "Org1",
  researchAdmin: "Org2",
  researcher: "Org2",
  insuranceAdmin: "Org2",
  insuranceAgent: "Org2",
  insuranceCompany: "Org2"
};

// Org → Admin identity mapping (remains the same)
const orgToAdminID = {
  Org1: "hospitalAdmin",
  Org2: "researchAdmin",
};

/**
 * Register a user with the CA, store their identity on Pinata, and create their on-ledger profile.
 */
const registerUser = async (enrollId, userID, userRole, args) => {
    const orgID = roleToOrg[userRole];
    if (!orgID) {
        throw new Error(`Invalid user role: ${userRole}. Please check roleToOrg mapping.`);
    }

    // Load CCP
    const ccpPath = path.resolve(__dirname, "..", "fabric-samples", "test-network", "organizations", "peerOrganizations", `${orgID}.example.com`.toLowerCase(), `connection-${orgID}.json`.toLowerCase());
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    const orgMSP = ccp.organizations[orgID].mspid;

    const caOrg = ccp.organizations[orgID].certificateAuthorities[0];
    const caURL = ccp.certificateAuthorities[caOrg].url;
    const ca = new FabricCAServices(caURL);
    
    // Check if identity already exists on Pinata to avoid re-registering
    const existingIdentityOnPinata = await PinataWallet.retrieveIdentity(userID);
    if (existingIdentityOnPinata) {
        console.log(`⚠️ Identity for ${userID} already exists on Pinata.`);
    } else {
        // --- MODIFICATION START ---
        // Instead of a FileSystemWallet, we now fetch the admin from Pinata
        // and load it into a temporary in-memory wallet.
        
        const adminID = enrollId || orgToAdminID[orgID];
        
        // 1. Retrieve the required admin identity from Pinata
        const adminIdentity = await PinataWallet.retrieveIdentity(adminID);
        if (!adminIdentity) {
            throw new Error(`Admin identity '${adminID}' not found on Pinata. Please run the appropriate admin enrollment script first.`);
        }

        // 2. Load the admin identity into a temporary in-memory wallet to get the user context
        const tempWallet = await Wallets.newInMemoryWallet();
        await tempWallet.put(adminID, adminIdentity);

        const provider = tempWallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, adminID);
        
        // --- MODIFICATION END ---

        console.log(`Using admin identity: ${adminID} (${orgID}) from Pinata`);
        console.log(`Registering new user ${userID} (${userRole}) in ${orgID}...`);

        const secret = await ca.register({
            affiliation: `${orgID.toLowerCase()}.department1`,
            enrollmentID: userID,
            role: 'client',
            attrs: [
                { name: "role", value: userRole, ecert: true },
                { name: "uuid", value: userID, ecert: true },
            ],
        }, adminUser); // Use the admin user context from the in-memory wallet

        const enrollment = await ca.enroll({
            enrollmentID: userID,
            enrollmentSecret: secret,
            attr_reqs: [
                { name: "role", optional: false },
                { name: "uuid", optional: false },
            ],
        });

        const x509Identity = {
            credentials: { certificate: enrollment.certificate, privateKey: enrollment.key.toBytes() },
            mspId: orgMSP,
            type: "X.509",
        };
        await PinataWallet.storeIdentity(userID, x509Identity);
    }

    // --- Chaincode Submission Logic ---
    let submitterIdentityName;
    if (["doctor", "diagnostics", "pharmacy", "patient"].includes(userRole.toLowerCase())) {
        if (!args?.hospitalId) throw new Error(`${userRole} registration requires args.hospitalId`);
        submitterIdentityName = args.hospitalId;
    } else if (userRole.toLowerCase() === "researcher") {
        submitterIdentityName = "researchAdmin";
    } else if (userRole === "insuranceAgent" || userRole === "insuranceCompany") {
        submitterIdentityName = "insuranceAdmin";
    } else if (userRole === "hospital") {
        submitterIdentityName = "hospitalAdmin";
    } else {
        submitterIdentityName = userID;
    }
    
    // Retrieve the submitter's identity from Pinata ONLY
    const submitterIdentity = await PinataWallet.retrieveIdentity(submitterIdentityName);
    console.log(`Using submitter identity: ${submitterIdentityName} (${orgID}) from Pinata`);
    if (!submitterIdentity) {
        throw new Error(`Submitter identity '${submitterIdentityName}' not found on Pinata.`);
    }

    console.log(`➡️ Submitting chaincode as ${submitterIdentityName} for role=${userRole} (org=${orgID})`);
    
    const gateway = new Gateway();
    await gateway.connect(ccp, {
        identity: submitterIdentity, // Use the identity object directly
        discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("ehrChainCode");

    let buffer;
    switch (userRole) {
        case "patient":
            buffer = await contract.submitTransaction("registerPatient", JSON.stringify({ patientId: userID, ...args }));
            break;
        case "hospital":
            buffer = await contract.submitTransaction("registerHospital", JSON.stringify({ hospitalId: userID, ...args }));
            break;
        case "doctor":
            buffer = await contract.submitTransaction("createDoctor", JSON.stringify({ doctorId: userID, ...args }));
            break;
        case "diagnostics":
            buffer = await contract.submitTransaction("createDiagnosticsCenter", JSON.stringify({ diagnosticsId: userID, ...args }));
            break;
        case "pharmacy":
             buffer = await contract.submitTransaction("createPharmacy", JSON.stringify({ pharmacyId: userID, ...args }));
            break;
        case "researcher":
            buffer = await contract.submitTransaction("onboardResearcher", JSON.stringify({ researcherId: userID, ...args }));
            break;
        case "insuranceAgent":
            buffer = await contract.submitTransaction("onboardInsurance", JSON.stringify({ agentId: userID, ...args }));
            break;
        case "insuranceCompany":
            buffer = await contract.submitTransaction("onboardInsuranceCompany", JSON.stringify({ companyId: userID, ...args }));
            break;
        default:
            throw new Error(`Unhandled userRole: ${userRole}`);
    }

    gateway.disconnect();

    return {
        statusCode: 200,
        userID,
        role: userRole,
        submitter: submitterIdentityName,
        message: `${userID} (${userRole}) registered and on-chain profile created in ${orgID}.`,
        chaincodeRes: buffer ? buffer.toString() : undefined,
    };
};

const login = async (userID) => {
    console.log(`Logging in user ${userID}...`);
    // Check if the user's identity exists on Pinata
    const identity = await PinataWallet.retrieveIdentity(userID);

    if (!identity) {
        return { statusCode: 404, message: `Identity for ${userID} not found.` };
    }

    return {
        statusCode: 200,
        userID,
        message: `Login successful for ${userID}`,
    };
};

module.exports = { registerUser, login };