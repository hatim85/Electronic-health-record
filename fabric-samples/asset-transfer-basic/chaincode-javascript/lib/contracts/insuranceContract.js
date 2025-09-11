const { _stringify } = require('../utils/helper.js');
const { getCallerAttributes } = require('../utils/identity.js');

async function issueInsurance(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;
    const { role, uuid: callerId } = getCallerAttributes(ctx);
    const orgMSP = ctx.clientIdentity.getMSPID();

    // Only insurance admin or agent from Org2 can issue insurance
    if (
        orgMSP !== 'Org2MSP' ||
        !['insuranceAdmin', 'insuranceAgent'].includes(role)
    ) {
        throw new Error(
            'Only insurance admin or insurance agent (Org2) can issue insurance'
        );
    }

    if (!args.policyNumber || !args.patientId || !args.coverageAmount) {
        throw new Error(
            'policyNumber, patientId and coverageAmount are required'
        );
    }

    // Optional: enforce max coverage limit for agents
    if (role === 'insuranceAgent' && args.coverageAmount > 50000) {
        // example limit
        throw new Error(
            'Insurance agents can issue max coverage of 50000 only'
        );
    }

    const insuranceKey = ctx.stub.createCompositeKey('insurance', [
        args.policyNumber,
    ]);

    const txTimestamp = ctx.stub.getTxTimestamp();
    const issuedAt = new Date(txTimestamp.seconds.low * 1000).toISOString();

    const insuranceObj = {
        docType: 'insurance',
        policyNumber: args.policyNumber,
        insuranceId: callerId,
        insuranceCompany: args.insuranceCompany,
        patientId: args.patientId,
        coverageAmount: args.coverageAmount,
        issuedAt,
        claims: [],
    };

    await ctx.stub.putState(
        insuranceKey,
        Buffer.from(_stringify(insuranceObj))
    );
    return _stringify({
        success: true,
        message: 'Insurance issued',
        policyNumber: args.policyNumber,
    });
}

async function approveClaim(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;
    const { role } = getCallerAttributes(ctx);


    if (!args.claimId) throw new Error('claimId required');

    const claimKey = ctx.stub.createCompositeKey('claim', [args.claimId]);
    const claimBytes = await ctx.stub.getState(claimKey);
    if (!claimBytes || claimBytes.length === 0) {
        throw new Error(`Claim ${args.claimId} not found`);
    }

    const claim = JSON.parse(claimBytes.toString());

    // Deterministic status update
    const timestamp = ctx.stub.getTxTimestamp();
    claim.status = 'APPROVED';
    claim.approvedAt = new Date(timestamp.seconds * 1000).toISOString();

    await ctx.stub.putState(claimKey, Buffer.from(_stringify(claim)));

    return _stringify({
        success: true,
        message: 'Claim approved',
        claimId: args.claimId,
    });
}


module.exports = {
    issueInsurance,
    approveClaim,
};
