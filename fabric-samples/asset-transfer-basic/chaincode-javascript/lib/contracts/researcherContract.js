const { _genId, _stringify } = require("../utils/helper.js");
const { getCallerAttributes } = require("../utils/query.js");

async function storeResearchResult(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;
    const { role, uuid: callerId } = getCallerAttributes(ctx);

    if (role !== 'researcher') throw new Error('Only researchers can store research results');
    if (!args.datasetType || !args.resultSummary) throw new Error('datasetType and resultSummary required');

    const resultId = _genId(ctx, 'research');
    const resultKey = ctx.stub.createCompositeKey('researchResult', [resultId]);

    const researchResult = {
        docType: 'researchResult',
        resultId,
        researcherId: callerId,
        datasetType: args.datasetType,
        resultSummary: args.resultSummary,
        createdAt: new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString()
    };

    await ctx.stub.putState(resultKey, Buffer.from(_stringify(researchResult)));
    return _stringify({ success: true, message: 'Research result stored', resultId });
}

module.exports = {
    storeResearchResult
};