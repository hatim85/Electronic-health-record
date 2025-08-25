const { _stringify } = require("../utils/helper.js");
const { getCallerAttributes } = require("../utils/query.js");

async function registerPatient(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;

    // Validate
    if (!args.patientId || !args.name || !args.dob) {
        throw new Error('Missing required fields: patientId, name, dob');
    }

    // Key
    const patientKey = ctx.stub.createCompositeKey('patient', [args.patientId]);
    const exists = await ctx.stub.getState(patientKey);
    if (exists && exists.length > 0) {
        throw new Error(`Patient ${args.patientId} already exists`);
    }

    // Create patient object with docType and createdBy
    // createdBy: use caller uuid if provided; otherwise allow hospital creation
    const caller = getCallerAttributes(ctx);

    const patient = {
        docType: 'patient',
        createdBy: caller.uuid,
        hospitalId: args.hospitalId,
        patientId: args.patientId,
        name: args.name,
        dob: args.dob,
        city: args.city || '',
        authorizedEntities: [], // list of doctorIds
        createdAt: new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString()
    };

    await ctx.stub.putState(patientKey, Buffer.from(_stringify(patient)));
    return _stringify({ success: true, message: `Patient ${args.patientId} registered` });
}

async function registerHospital(ctx, hospitalDataJson) {
    const hospital = JSON.parse(hospitalDataJson);
    console.log('Registering hospital:', hospital);

    if (!hospital.hospitalId || !hospital.hospitalName || !hospital.city) {
        throw new Error('Missing required fields: hospitalId, hospitalName, city');
    }

    const exists = await ctx.stub.getState(hospital.hospitalId);
    if (exists && exists.length > 0) {
        throw new Error(`Hospital ${hospital.hospitalId} already exists`);
    }

    hospital.docType = "hospital";

    await ctx.stub.putState(hospital.hospitalId, Buffer.from(_stringify(hospital)));
    return JSON.stringify(hospital);
}

async function createDoctor(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;

    const caller = getCallerAttributes(ctx);
    const orgMSP = ctx.clientIdentity.getMSPID();

    if (orgMSP !== 'Org1MSP' || caller.role !== 'hospital') {
        throw new Error('Only hospitals (Org1) can create doctor profiles');
    }

    if (!args.doctorId || !args.name || !args.hospitalId) {
        throw new Error('Missing required fields: doctorId, name, hospitalId');
    }

    // Use same key format as update/delete
    const doctorKey = `${args.hospitalId}_DOCTOR_${args.doctorId}`;
    const exists = await ctx.stub.getState(doctorKey);
    if (exists && exists.length > 0) {
        throw new Error(`Doctor ${args.doctorId} already exists in hospital ${args.hospitalId}`);
    }

    const doctorRecord = {
        docType: 'doctor',
        createdBy: caller.uuid,
        doctorId: args.doctorId,
        name: args.name,
        specialization: args.specialization || '',
        city: args.city || '',
        hospitalId: args.hospitalId, // Store hospitalId for reference
        createdAt: new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString(),
        status: 'ACTIVE'
    };

    await ctx.stub.putState(doctorKey, Buffer.from(_stringify(doctorRecord)));
    return _stringify({ success: true, message: `Doctor ${args.doctorId} created in hospital ${args.hospitalId}` });
}

async function createDiagnosticsCenter(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;

    const { role, uuid: callerId } = getCallerAttributes(ctx);
    const orgMSP = ctx.clientIdentity.getMSPID();

    if (orgMSP !== 'Org1MSP' || role !== 'hospital') {
        throw new Error('Only hospitals (Org1) can create diagnostics center profiles');
    }

    if (!args.diagnosticsId || !args.name) {
        throw new Error('Missing required fields: diagnosticsId, name');
    }

    const diagKey = ctx.stub.createCompositeKey('diagnostics', [args.diagnosticsId]);
    const exists = await ctx.stub.getState(diagKey);
    if (exists && exists.length > 0) {
        throw new Error(`Diagnostics center ${args.diagnosticsId} already exists`);
    }

    const diagnosticsRecord = {
        docType: 'diagnostics',
        createdBy: callerId,
        diagnosticsId: args.diagnosticsId,
        name: args.name,
        city: args.city || '',
        createdAt: new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString(),
        status: 'ACTIVE'
    };

    await ctx.stub.putState(diagKey, Buffer.from(_stringify(diagnosticsRecord)));
    return _stringify({ success: true, message: `Diagnostics center ${args.diagnosticsId} created` });
}

async function createPharmacy(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;

    const { role, uuid: callerId } = getCallerAttributes(ctx);
    const orgMSP = ctx.clientIdentity.getMSPID();

    // Only hospitals from Org1 can create a pharmacy profile
    if (orgMSP !== 'Org1MSP' || role !== 'hospital') {
        throw new Error('Only hospitals (Org1) can create pharmacy profiles');
    }

    if (!args.pharmacyId || !args.name) {
        throw new Error('Missing required fields: pharmacyId, name');
    }

    const pharmacyKey = ctx.stub.createCompositeKey('pharmacy', [args.pharmacyId]);
    const exists = await ctx.stub.getState(pharmacyKey);
    if (exists && exists.length > 0) {
        throw new Error(`Pharmacy ${args.pharmacyId} already exists`);
    }

    const pharmacyRecord = {
        docType: 'pharmacy',
        createdBy: callerId,
        pharmacyId: args.pharmacyId,
        name: args.name,
        city: args.city || '',
        hospitalId: args.hospitalId || '', // Include if needed
        createdAt: new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString(),
        status: 'ACTIVE'
    };

    await ctx.stub.putState(pharmacyKey, Buffer.from(_stringify(pharmacyRecord)));
    return _stringify({
        success: true,
        message: `Pharmacy ${args.pharmacyId} created successfully`
    });
}

async function onboardResearcher(ctx, args) {
    // Parse args if it's a JSON string
    args = typeof args === 'string' ? JSON.parse(args) : args;

    const caller = getCallerAttributes(ctx);
    const orgMSP = ctx.clientIdentity.getMSPID();

    // Access control: Only research admins from Org2 can create researcher profiles
    if (orgMSP !== 'Org2MSP' || caller.role !== 'researchAdmin') {
        throw new Error('Only research admins (Org2) can onboard researchers');
    }

    // Validate required fields
    if (!args.researcherId || !args.name || !args.institution) {
        throw new Error('Missing required fields: researcherId, name, institution');
    }

    const researcherKey = ctx.stub.createCompositeKey('researcher', [args.researcherId]);
    const exists = await ctx.stub.getState(researcherKey);
    if (exists && exists.length > 0) {
        throw new Error(`Researcher ${args.researcherId} already exists`);
    }

    // Build researcher record
    const researcherRecord = {
        docType: 'researcher',
        createdBy: caller.uuid,
        researcherId: args.researcherId,
        name: args.name,
        institution: args.institution,
        createdAt: new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString(),
        status: 'ACTIVE'
    };

    await ctx.stub.putState(researcherKey, Buffer.from(_stringify(researcherRecord)));
    return _stringify({
        success: true,
        message: `Researcher ${args.researcherId} onboarded successfully`
    });
}

async function onboardInsurance(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;
    const caller = getCallerAttributes(ctx);
    const orgMSP = ctx.clientIdentity.getMSPID();

    // Access control: Only insurance companies/admins from Org2 can onboard agents
    if (orgMSP !== 'Org2MSP' || caller.role !== 'insuranceAdmin') {
        throw new Error('Only insurance admins (Org2) can onboard insurance agents');
    }

    // Validate required fields
    if (!args.agentId || !args.insuranceCompany || !args.name || !args.city) {
        throw new Error('Missing required fields: agentId, insuranceCompany, name, city');
    }

    // Ensure agent doesn't already exist
    const agentKey = ctx.stub.createCompositeKey('insuranceAgent', [args.agentId]);
    const existing = await ctx.stub.getState(agentKey);
    if (existing && existing.length > 0) {
        throw new Error(`Insurance agent ${args.agentId} already exists`);
    }

    // Create record
    const agentRecord = {
        docType: 'insuranceAgent',
        createdBy: caller.uuid,
        agentId: args.agentId,
        insuranceCompany: args.insuranceCompany,
        name: args.name,
        city: args.city,
        createdAt: new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString(),
        status: 'ACTIVE',
        walletBalance: 0  // default balance, adjust if you want a starting amount
    };

    await ctx.stub.putState(agentKey, Buffer.from(_stringify(agentRecord)));

    return _stringify({
        success: true,
        message: `Insurance agent ${args.agentId} onboarded successfully`
    });
}

module.exports = {
    registerPatient,
    registerHospital,
    createDoctor,
    createDiagnosticsCenter,
    createPharmacy,
    onboardResearcher,
    onboardInsurance
};