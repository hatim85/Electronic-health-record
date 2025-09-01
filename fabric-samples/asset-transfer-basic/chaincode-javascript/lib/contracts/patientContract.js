const { _genId, _stringify, creditReward } = require('../utils/helper.js');
const { getCallerAttributes } = require('../utils/identity.js');

async function grantAccess(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;

    if (!args.patientId || !args.entityId || !args.entityRole) {
        throw new Error('patientId, entityId, and entityRole are required');
    }

    const { role: callerRole, uuid: callerId } = getCallerAttributes(ctx);

    if (callerRole !== 'patient') {
        throw new Error('Only patients can grant access');
    }

    if (callerId !== args.patientId) {
        throw new Error('Caller is not the owner of this patient record');
    }

    // Fetch patient record
    const patientKey = ctx.stub.createCompositeKey('patient', [args.patientId]);
    const patientBytes = await ctx.stub.getState(patientKey);
    if (!patientBytes || patientBytes.length === 0) {
        throw new Error(`Patient ${args.patientId} not found`);
    }

    const patient = JSON.parse(patientBytes.toString());
    if (!Array.isArray(patient.authorizedEntities))
        patient.authorizedEntities = [];

    // Add entity to authorizedEntities if not already
    if (!patient.authorizedEntities.includes(args.entityId)) {
        patient.authorizedEntities.push(args.entityId);

        const txTimestamp = ctx.stub.getTxTimestamp();
        patient.updatedAt = new Date(
            txTimestamp.seconds.low * 1000
        ).toISOString();

        await ctx.stub.putState(patientKey, Buffer.from(_stringify(patient)));
    }

    // Create consent record for entity
    const consentKey = ctx.stub.createCompositeKey('consent', [
        args.patientId,
        args.entityId,
    ]);
    const consentRecord = {
        patientId: args.patientId,
        entityId: args.entityId,
        entityRole: args.entityRole,
        status: 'approved',
        grantedAt: new Date(
            ctx.stub.getTxTimestamp().seconds.low * 1000
        ).toISOString(),
    };
    await ctx.stub.putState(consentKey, Buffer.from(_stringify(consentRecord)));

    // Reward the patient if entityRole is rewardable
    const rewardableRoles = ['researcher', 'insuranceAdmin'];
    if (rewardableRoles.includes(args.entityRole)) {
        await creditReward(ctx, { patientId: args.patientId, points: 10 }); // adjust points as needed
    }

    return _stringify({
        success: true,
        message: `Entity ${args.entityId} (${args.entityRole}) authorized, consent recorded, reward credited if applicable`,
    });
}

// async function createClaim(ctx, args) {
//     args = typeof args === 'string' ? JSON.parse(args) : args;
//     const { role, uuid } = getCallerAttributes(ctx);

//     if (role !== 'patient') throw new Error('Only patients can create claims');

//     if (!args.policyNumber || !args.amount || !args.reason) {
//         throw new Error('policyNumber, amount and reason are required');
//     }

//     // Fetch the insurance policy
//     const insuranceKey = ctx.stub.createCompositeKey('insurance', [
//         args.policyNumber,
//     ]);
//     const insuranceBytes = await ctx.stub.getState(insuranceKey);
//     if (!insuranceBytes || insuranceBytes.length === 0) {
//         throw new Error(
//             `Insurance with policyNumber ${args.policyNumber} not found`
//         );
//     }

//     const insurance = JSON.parse(insuranceBytes.toString());

//     const claimId = _genId(ctx, 'claim');
//     const claimKey = ctx.stub.createCompositeKey('claim', [claimId]);

//     const claim = {
//         docType: 'claim',
//         claimId,
//         policyNumber: args.policyNumber,
//         patientId: uuid,
//         insuranceId: insurance.insuranceId,
//         insuranceCompany: insurance.insuranceCompany,
//         amount: args.amount,
//         reason: args.reason,
//         status: 'PENDING',
//         requestedAt: new Date().toISOString(),
//     };

//     await ctx.stub.putState(claimKey, Buffer.from(_stringify(claim)));
//     return _stringify({ success: true, message: 'Claim created', claimId });
// }

async function createClaim(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;
    const { role, uuid } = getCallerAttributes(ctx);

    if (role !== 'patient') throw new Error('Only patients can create claims');

    if (!args.policyNumber || !args.amount || !args.reason) {
        throw new Error('policyNumber, amount and reason are required');
    }

    // Fetch insurance policy
    const insuranceKey = ctx.stub.createCompositeKey('insurance', [args.policyNumber]);
    const insuranceBytes = await ctx.stub.getState(insuranceKey);
    if (!insuranceBytes || insuranceBytes.length === 0) {
        throw new Error(`Insurance with policyNumber ${args.policyNumber} not found`);
    }

    const insurance = JSON.parse(insuranceBytes.toString());

    // Use txId and txTimestamp for determinism
    const txId = ctx.stub.getTxID();
    const timestamp = ctx.stub.getTxTimestamp();
    const requestedAt = new Date(timestamp.seconds * 1000).toISOString();

    const claimId = `claim-${txId}`;
    const claimKey = ctx.stub.createCompositeKey('claim', [claimId]);

    const claim = {
        docType: 'claim',
        claimId,
        policyNumber: args.policyNumber,
        patientId: uuid,
        insuranceId: insurance.insuranceId,
        insuranceCompany: insurance.insuranceCompany,
        amount: args.amount,
        reason: args.reason,
        status: 'PENDING',
        requestedAt,
    };

    await ctx.stub.putState(claimKey, Buffer.from(_stringify(claim)));
    return _stringify({ success: true, message: 'Claim created', claimId });
}

async function useReward(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;
    const { role, uuid } = getCallerAttributes(ctx);
    if (role !== 'patient')
        throw new Error('Only patient can use reward tokens');

    if (!args.patientId || !args.amount)
        throw new Error('patientId and amount required');
    if (uuid !== args.patientId)
        throw new Error('Patient can only use own rewards');

    const rewardKey = ctx.stub.createCompositeKey('reward', [args.patientId]);
    const rewardBytes = await ctx.stub.getState(rewardKey);
    let rewardData = { patientId: args.patientId, balance: 0 };
    if (rewardBytes && rewardBytes.length > 0)
        rewardData = JSON.parse(rewardBytes.toString());

    const amount = parseInt(args.amount, 10);
    if (isNaN(amount) || amount <= 0) throw new Error('Invalid amount');

    if (rewardData.balance < amount)
        throw new Error(`Insufficient reward balance: ${rewardData.balance}`);

    rewardData.balance -= amount;
    rewardData.updatedAt = new Date().toISOString();

    await ctx.stub.putState(rewardKey, Buffer.from(_stringify(rewardData)));
    return _stringify({
        success: true,
        message: 'Reward used',
        newBalance: rewardData.balance,
    });
}

module.exports = {
    grantAccess,
    createClaim,
    useReward
};
