const stringify = require('json-stringify-deterministic');
const { getCallerAttributes } = require("./query.js");

async function creditReward(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;
    const caller = getCallerAttributes(ctx);

    // If patient is the caller, allow only self-rewarding
    const allowedRoles = ['researcher', 'insuranceAdmin', 'patient'];
    if (!allowedRoles.includes(caller.role)) {
        throw new Error('Only researchers, insurance admins, or patients can credit rewards');
    }

    if (!args.patientId || args.points == null) {
        throw new Error('patientId and points are required');
    }

    // Patients can only credit themselves
    if (caller.role === 'patient' && caller.uuid !== args.patientId) {
        throw new Error('Patients can only credit their own rewards');
    }

    const rewardKey = ctx.stub.createCompositeKey('reward', [args.patientId]);
    let rewardData = { patientId: args.patientId, balance: 0 };

    const rewardBytes = await ctx.stub.getState(rewardKey);
    if (rewardBytes && rewardBytes.length > 0) {
        rewardData = JSON.parse(rewardBytes.toString());
    }

    const points = parseInt(args.points, 10);
    if (isNaN(points) || points <= 0) throw new Error('points must be a positive integer');

    rewardData.balance = (rewardData.balance || 0) + points;
    rewardData.updatedAt = new Date().toISOString();

    await ctx.stub.putState(rewardKey, Buffer.from(_stringify(rewardData)));

    return _stringify({
        success: true,
        message: `Credited ${points} tokens to ${args.patientId}`,
        newBalance: rewardData.balance
    });
}

function _genId(ctx, prefix = '') {
    const txId = ctx.stub.getTxID();
    return prefix ? `${prefix}-${txId}` : txId;
}

function _stringify(obj) {
    return stringify(obj);
}

module.exports = {
    creditReward,
    _genId,
    _stringify
};