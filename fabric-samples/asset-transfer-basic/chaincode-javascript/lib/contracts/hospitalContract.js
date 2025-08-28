const { _stringify } = require('../utils/helper.js');
const { getCallerAttributes } = require('../utils/identity.js');

async function updateDoctorProfile(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;

    if (!args.hospitalId || !args.doctorId) {
        throw new Error('hospitalId and doctorId are required');
    }

    const doctorKey = `${args.hospitalId}_DOCTOR_${args.doctorId}`;
    const doctorBytes = await ctx.stub.getState(doctorKey);

    if (!doctorBytes || doctorBytes.length === 0) {
        throw new Error(
            `Doctor ${args.doctorId} does not exist in hospital ${args.hospitalId}`
        );
    }

    const doctor = JSON.parse(doctorBytes.toString());

    if (args.name) doctor.name = args.name;
    if (args.specialization) doctor.specialization = args.specialization;
    if (args.city) doctor.city = args.city;

    await ctx.stub.putState(doctorKey, Buffer.from(JSON.stringify(doctor)));
    return JSON.stringify(doctor);
}

async function deleteDoctorProfile(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;

    const caller = getCallerAttributes(ctx);
    const orgMSP = ctx.clientIdentity.getMSPID();

    if (orgMSP !== 'Org1MSP' || caller.role !== 'hospital') {
        throw new Error('Only hospitals (Org1) can delete doctor profiles');
    }

    if (!args.hospitalId || !args.doctorId) {
        throw new Error('hospitalId and doctorId are required');
    }

    const doctorKey = `${args.hospitalId}_DOCTOR_${args.doctorId}`;
    const doctorBytes = await ctx.stub.getState(doctorKey);

    if (!doctorBytes || doctorBytes.length === 0) {
        throw new Error(
            `Doctor ${args.doctorId} does not exist in hospital ${args.hospitalId}`
        );
    }

    await ctx.stub.deleteState(doctorKey);
    return _stringify({
        success: true,
        message: `Doctor ${args.doctorId} deleted successfully from hospital ${args.hospitalId}`,
    });
}

module.exports = {
    updateDoctorProfile,
    deleteDoctorProfile,
};
