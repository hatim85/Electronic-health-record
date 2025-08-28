const { _stringify } = require('../utils/helper.js');
const { getCallerAttributes } = require('../utils/identity.js');

async function updateMedicineStock(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;
    const { role, uuid: callerId } = getCallerAttributes(ctx);
    const orgMSP = ctx.clientIdentity.getMSPID();

    // Ensure only pharmacies from Org1 can update stock
    if (orgMSP !== 'Org1MSP' || role !== 'pharmacy') {
        throw new Error('Only pharmacies (Org1) can update medicine stock');
    }

    if (!args.medicineName || args.newStock == null) {
        throw new Error('medicineName and newStock are required');
    }

    const pharmacyId = callerId; // caller’s UUID as pharmacyId
    const stockKey = ctx.stub.createCompositeKey('medicineStock', [
        pharmacyId,
        args.medicineName,
    ]);

    let existingStock = 0;
    const existingBytes = await ctx.stub.getState(stockKey);
    if (existingBytes && existingBytes.length > 0) {
        const existingData = JSON.parse(existingBytes.toString());
        existingStock = existingData.quantity;
    }

    const updatedStock = parseInt(args.newStock, 10);
    if (isNaN(updatedStock) || updatedStock < 0) {
        throw new Error('Invalid stock value');
    }

    const stockRecord = {
        medicineName: args.medicineName,
        quantity: updatedStock,
        updatedBy: pharmacyId,
        updatedAt: new Date(
            ctx.stub.getTxTimestamp().seconds.low * 1000
        ).toISOString(),
        dispensedHistory: [], // keep history of sales here
    };

    await ctx.stub.putState(stockKey, Buffer.from(JSON.stringify(stockRecord)));

    return _stringify({
        success: true,
        message: `Stock updated for ${args.medicineName}`,
        oldStock: existingStock,
        newStock: updatedStock,
    });
}

async function dispenseMedicine(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;

    const { role, uuid: callerId } = getCallerAttributes(ctx);
    const orgMSP = ctx.clientIdentity.getMSPID();

    // Ensure only pharmacies from Org1 can dispense medicine
    if (orgMSP !== 'Org1MSP' || role !== 'pharmacy') {
        throw new Error('Only pharmacies (Org1) can dispense medicine');
    }

    const { patientId, recordId, medicineName, quantity } = args;
    if (!patientId || !recordId || !medicineName || !quantity) {
        throw new Error(
            'patientId, recordId, medicineName, and quantity are required'
        );
    }

    // 1. Fetch the patient record
    const recordKey = ctx.stub.createCompositeKey('record', [
        patientId,
        recordId,
    ]);
    const recordBytes = await ctx.stub.getState(recordKey);
    if (!recordBytes || recordBytes.length === 0) {
        throw new Error(
            `Record ${recordId} not found for patient ${patientId}`
        );
    }
    const record = JSON.parse(recordBytes.toString());

    // 2. Verify record belongs to patient
    if (record.patientId !== patientId) {
        throw new Error(
            `Record ${recordId} does not belong to patient ${patientId}`
        );
    }

    // 3. Verify prescription matches
    if (!record.prescription || record.prescription !== medicineName) {
        throw new Error(
            `Medicine ${medicineName} not prescribed in record ${recordId}`
        );
    }

    // 4. Fetch stock
    const pharmacyId = callerId;
    const stockKey = ctx.stub.createCompositeKey('medicineStock', [
        pharmacyId,
        medicineName,
    ]);
    const stockBytes = await ctx.stub.getState(stockKey);
    if (!stockBytes || stockBytes.length === 0) {
        throw new Error(
            `No stock record found for ${medicineName} at pharmacy ${pharmacyId}`
        );
    }
    const stock = JSON.parse(stockBytes.toString());

    // 5. Validate stock
    if (stock.quantity < quantity) {
        throw new Error(
            `Not enough stock for ${medicineName}. Available: ${stock.quantity}`
        );
    }

    // 6. Deduct quantity
    stock.quantity -= quantity;
    stock.updatedAt = new Date(
        ctx.stub.getTxTimestamp().seconds.low * 1000
    ).toISOString();

    // 7. Log dispensing in stock history
    if (!stock.dispensedHistory) stock.dispensedHistory = [];
    stock.dispensedHistory.push({
        patientId,
        recordId,
        medicineName,
        quantity,
        dispensedAt: new Date(
            ctx.stub.getTxTimestamp().seconds.low * 1000
        ).toISOString(),
    });

    await ctx.stub.putState(stockKey, Buffer.from(JSON.stringify(stock)));

    // 8. Log dispensing in patient record
    if (!record.dispensedMedicines) record.dispensedMedicines = [];
    record.dispensedMedicines.push({
        medicineName,
        quantity,
        pharmacyId,
        patientId,
        dispensedAt: new Date(
            ctx.stub.getTxTimestamp().seconds.low * 1000
        ).toISOString(),
    });

    await ctx.stub.putState(recordKey, Buffer.from(JSON.stringify(record)));

    return _stringify({
        success: true,
        message: `${quantity} ${medicineName}(s) dispensed to patient ${patientId}`,
        remainingStock: stock.quantity,
    });
}

module.exports = {
    updateMedicineStock,
    dispenseMedicine,
};
