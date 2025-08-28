const { _genId, _stringify } = require('../utils/helper.js');
const { getCallerAttributes } = require('../utils/identity.js');

async function uploadLabReport(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;
    const { role, uuid: callerId } = getCallerAttributes(ctx);
    const orgMSP = ctx.clientIdentity.getMSPID();

    // Only diagnostics (Org1) can upload lab reports
    if (orgMSP !== 'Org1MSP' || role !== 'diagnostics') {
        throw new Error('Only diagnostics (Org1) can upload lab reports');
    }

    if (!args.patientId || !args.reportType || !args.reportData) {
        throw new Error('patientId, reportType and reportData are required');
    }

    const reportId = _genId(ctx, 'lab');
    const recordKey = ctx.stub.createCompositeKey('record', [
        args.patientId,
        reportId,
    ]);

    const record = {
        docType: 'record',
        recordId: reportId,
        patientId: args.patientId,
        labReport: {
            labId: callerId,
            reportType: args.reportType,
            reportData: args.reportData,
            createdAt: new Date(
                ctx.stub.getTxTimestamp().seconds.low * 1000
            ).toISOString(),
        },
    };

    await ctx.stub.putState(recordKey, Buffer.from(_stringify(record)));
    return _stringify({
        success: true,
        message: 'Lab report uploaded',
        reportId,
    });
}

module.exports = { uploadLabReport };
