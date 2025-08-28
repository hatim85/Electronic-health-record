const { _stringify } = require('../utils/helper.js');
const { getCallerAttributes } = require('../utils/identity.js');

async function addRecord(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;

    if (!args.patientId || !args.diagnosis) {
        throw new Error('patientId and diagnosis are required');
    }

    const { role, uuid: callerId } = getCallerAttributes(ctx);
    if (role !== 'doctor') {
        throw new Error('Only doctors can add records');
    }

    const patientKey = ctx.stub.createCompositeKey('patient', [args.patientId]);
    const patientBytes = await ctx.stub.getState(patientKey);
    if (!patientBytes || patientBytes.length === 0) {
        throw new Error(`Patient ${args.patientId} not found`);
    }
    const patient = JSON.parse(patientBytes.toString());

    // enforce patient granted access to this doctor
    if (
        !patient.authorizedEntities ||
        !patient.authorizedEntities.includes(callerId)
    ) {
        throw new Error(
            `Doctor ${callerId} is not authorized for patient ${args.patientId}`
        );
    }

    // create record id and composite key per patient
    const txId = ctx.stub.getTxID();
    const recordId = `R-${txId}`;
    const recordKey = ctx.stub.createCompositeKey('record', [
        args.patientId,
        recordId,
    ]);

    const record = {
        docType: 'record',
        recordId,
        patientId: args.patientId,
        doctorId: callerId,
        diagnosis: args.diagnosis,
        prescription: args.prescription || '',
        createdAt: new Date(
            ctx.stub.getTxTimestamp().seconds.low * 1000
        ).toISOString(),
    };

    await ctx.stub.putState(recordKey, Buffer.from(_stringify(record)));

    // Optionally return the record id
    return _stringify({
        success: true,
        message: `Record ${recordId} added`,
        recordId,
    });
}

async function updatePatientRecord(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;

    if (!args.patientId || !args.recordId) {
        throw new Error('patientId and recordId are required');
    }

    const { role, uuid: callerId } = getCallerAttributes(ctx);
    if (role !== 'doctor') {
        throw new Error('Only doctors can update patient records');
    }

    // Verify patient exists
    const patientKey = ctx.stub.createCompositeKey('patient', [args.patientId]);
    const patientBytes = await ctx.stub.getState(patientKey);
    if (!patientBytes || patientBytes.length === 0) {
        throw new Error(`Patient ${args.patientId} not found`);
    }
    const patient = JSON.parse(patientBytes.toString());

    // Verify doctor is authorized for this patient
    if (
        !patient.authorizedEntities ||
        !patient.authorizedEntities.includes(callerId)
    ) {
        throw new Error(
            `Doctor ${callerId} is not authorized for patient ${args.patientId}`
        );
    }

    // Fetch the record
    const recordKey = ctx.stub.createCompositeKey('record', [
        args.patientId,
        args.recordId,
    ]);
    const recordBytes = await ctx.stub.getState(recordKey);
    if (!recordBytes || recordBytes.length === 0) {
        throw new Error(
            `Record ${args.recordId} not found for patient ${args.patientId}`
        );
    }

    const record = JSON.parse(recordBytes.toString());

    // Ensure only the doctor who created the record can update it
    if (record.doctorId !== callerId) {
        throw new Error(
            `Doctor ${callerId} is not the owner of record ${args.recordId}`
        );
    }

    // Update fields
    if (args.diagnosis) record.diagnosis = args.diagnosis;
    if (args.prescription) record.prescription = args.prescription;
    record.updatedAt = new Date(
        ctx.stub.getTxTimestamp().seconds.low * 1000
    ).toISOString();

    // Save back
    await ctx.stub.putState(recordKey, Buffer.from(_stringify(record)));

    return _stringify({
        success: true,
        message: `Record ${args.recordId} updated`,
        record,
    });
}

async function uploadPatientDescription(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;

    if (!args.patientId || !args.description) {
        throw new Error('patientId and description are required');
    }

    const { role, uuid: callerId } = getCallerAttributes(ctx);
    if (role !== 'doctor') {
        throw new Error('Only doctors can upload patient descriptions');
    }

    // Verify patient exists
    const patientKey = ctx.stub.createCompositeKey('patient', [args.patientId]);
    const patientBytes = await ctx.stub.getState(patientKey);
    if (!patientBytes || patientBytes.length === 0) {
        throw new Error(`Patient ${args.patientId} not found`);
    }
    const patient = JSON.parse(patientBytes.toString());

    // Verify doctor is authorized for this patient
    if (
        !patient.authorizedEntities ||
        !patient.authorizedEntities.includes(callerId)
    ) {
        throw new Error(
            `Doctor ${callerId} is not authorized for patient ${args.patientId}`
        );
    }

    // Create a description entry (similar to record, but separated)
    const txId = ctx.stub.getTxID();
    const descId = `D-${txId}`;
    const descKey = ctx.stub.createCompositeKey('description', [
        args.patientId,
        descId,
    ]);

    const descriptionEntry = {
        docType: 'description',
        descId,
        patientId: args.patientId,
        doctorId: callerId,
        description: args.description,
        createdAt: new Date(
            ctx.stub.getTxTimestamp().seconds.low * 1000
        ).toISOString(),
    };

    await ctx.stub.putState(descKey, Buffer.from(_stringify(descriptionEntry)));

    return _stringify({
        success: true,
        message: `Description ${descId} uploaded`,
        descriptionId: descId,
    });
}

module.exports = { addRecord, updatePatientRecord, uploadPatientDescription };
