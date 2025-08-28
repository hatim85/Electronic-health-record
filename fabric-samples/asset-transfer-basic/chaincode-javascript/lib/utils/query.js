const { _stringify } = require('./helper.js');
const { getCallerAttributes } = require('./identity.js');

async function getAllRecordsByPatientId(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;
    if (!args.patientId) throw new Error('patientId is required');

    const { role, uuid: callerId } = getCallerAttributes(ctx);

    // 🔐 Authorization check
    const patientKey = ctx.stub.createCompositeKey('patient', [args.patientId]);
    const patientBytes = await ctx.stub.getState(patientKey);
    if (!patientBytes || patientBytes.length === 0) {
        throw new Error(`Patient ${args.patientId} not found`);
    }
    const patient = JSON.parse(patientBytes.toString());

    const allowed = (() => {
        if (role === 'patient' && callerId === args.patientId) return true;
        if (role === 'doctor' && patient.authorizedEntities?.includes(callerId))
            return true;
        if (role === 'hospital') return true;
        if (role === 'researcher') {
            return (async () => {
                const consentKey = ctx.stub.createCompositeKey('consent', [
                    args.patientId,
                    callerId,
                ]);
                const consentBytes = await ctx.stub.getState(consentKey);
                if (!consentBytes || consentBytes.length === 0) return false;
                const consent = JSON.parse(consentBytes.toString());
                return consent.status === 'approved';
            })();
        }
        if (['diagnostics', 'pharmacy', 'insuranceAdmin'].includes(role)) {
            return true;
        }
        return false;
    })();

    const isAllowed =
        typeof allowed.then === 'function' ? await allowed : allowed;
    if (!isAllowed) {
        throw new Error('Caller not authorized to read patient records');
    }

    const results = [];

    // ✅ 1. Treatments / prescriptions stored under "record" or "treatment"
    for (const prefix of ['record', 'treatment']) {
        const iterator = await ctx.stub.getStateByPartialCompositeKey(prefix, [
            args.patientId,
        ]);
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value) {
                try {
                    results.push(JSON.parse(res.value.value.toString('utf8')));
                } catch (err) {
                    console.error(`Failed to parse ${prefix}`, err);
                }
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }
    }

    // ✅ 2. Lab reports under "labReport"
    const labIterator = await ctx.stub.getStateByPartialCompositeKey(
        'labReport',
        []
    );
    while (true) {
        const res = await labIterator.next();
        if (res.value && res.value.value) {
            try {
                const obj = JSON.parse(res.value.value.toString('utf8'));
                if (obj.patientId === args.patientId) results.push(obj);
            } catch (err) {
                console.error('Failed to parse labReport', err);
            }
        }
        if (res.done) {
            await labIterator.close();
            break;
        }
    }

    // ✅ 3. Pharmacy dispenses under "dispense"
    const dispIterator = await ctx.stub.getStateByPartialCompositeKey(
        'dispense',
        []
    );
    while (true) {
        const res = await dispIterator.next();
        if (res.value && res.value.value) {
            try {
                const obj = JSON.parse(res.value.value.toString('utf8'));
                if (obj.patientId === args.patientId) results.push(obj);
            } catch (err) {
                console.error('Failed to parse dispense', err);
            }
        }
        if (res.done) {
            await dispIterator.close();
            break;
        }
    }

    // ✅ Sort chronologically
    results.sort(
        (a, b) =>
            new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date)
    );

    return _stringify(results);
}

async function getAllPatientsWithRecordsByDoctor(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;

    if (!args.doctorId) throw new Error('doctorId is required');

    const { role, uuid: callerId } = getCallerAttributes(ctx);
    if (role !== 'doctor' || callerId !== args.doctorId) {
        throw new Error('Only the doctor themself can fetch their patients with records');
    }

    // Step 1: fetch patients
    const patientIterator = await ctx.stub.getStateByPartialCompositeKey('patient', []);
    const patients = [];

    while (true) {
        const res = await patientIterator.next();
        if (res.value && res.value.value) {
            try {
                const patient = JSON.parse(res.value.value.toString('utf8'));
                if (
                    patient.authorizedEntities &&
                    patient.authorizedEntities.includes(args.doctorId)
                ) {
                    patients.push(patient);
                }
            } catch (err) {
                console.error('Failed to parse patient record', err);
            }
        }
        if (res.done) {
            await patientIterator.close();
            break;
        }
    }

    // Step 2: fetch records for each patient
    for (const patient of patients) {
        const recordIterator = await ctx.stub.getStateByPartialCompositeKey('record', [
            patient.patientId,
        ]);
        const records = [];

        while (true) {
            const res = await recordIterator.next();
            if (res.value && res.value.value) {
                try {
                    records.push(JSON.parse(res.value.value.toString('utf8')));
                } catch (err) {
                    console.error('Failed to parse record', err);
                }
            }
            if (res.done) {
                await recordIterator.close();
                break;
            }
        }

        // attach records (diagnosis + prescriptions etc.) to the patient
        patient.records = records;
    }

    return _stringify(patients);
}


async function getPatientPrescription(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;
    if (!args.patientId) throw new Error('patientId required');

    // delegates to getAllRecordsByPatientId but filters for prescriptions
    const recordsJSON = await getAllRecordsByPatientId(
        ctx,
        JSON.stringify({ patientId: args.patientId })
    );
    const records = JSON.parse(recordsJSON);
    // return only records with prescription
    const prescriptions = records.filter(
        (r) => r.prescription && r.prescription.length > 0
    );
    return _stringify(prescriptions);
}

async function getAllPatientsByDoctor(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;

    if (!args.doctorId) throw new Error('doctorId is required');

    const { role, uuid: callerId } = getCallerAttributes(ctx);
    if (role !== 'doctor' || callerId !== args.doctorId) {
        throw new Error('Only the doctor themself can fetch their patients');
    }

    const iterator = await ctx.stub.getStateByPartialCompositeKey(
        'patient',
        []
    );
    const patients = [];

    while (true) {
        const res = await iterator.next();

        if (res.value && res.value.value) {
            try {
                const patient = JSON.parse(res.value.value.toString('utf8'));
                if (
                    patient.authorizedEntities &&
                    patient.authorizedEntities.includes(args.doctorId)
                ) {
                    patients.push(patient);
                }
            } catch (err) {
                console.error('Failed to parse patient record', err);
            }
        }

        if (res.done) {
            await iterator.close();
            break;
        }
    }

    return _stringify(patients);
}

async function getAllDoctorsByHospital(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;
    if (!args.hospitalId) throw new Error('hospitalId required');

    const query = {
        selector: {
            docType: 'doctor',
            createdBy: args.hospitalId,
        },
    };

    const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    const results = [];
    while (true) {
        const res = await iterator.next();
        if (res.value && res.value.value.toString()) {
            results.push(JSON.parse(res.value.value.toString()));
        }
        if (res.done) {
            await iterator.close();
            break;
        }
    }
    return _stringify(results);
}

async function getAllPatientsByHospital(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;
    const hospitalId = args.hospitalId || args;

    const query = {
        selector: {
            docType: 'patient',
            hospitalId: hospitalId,
        },
    };

    const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    const results = [];

    while (true) {
        const res = await iterator.next();

        if (res.value && res.value.value.toString()) {
            const rawValue = res.value.value.toString('utf8');
            try {
                const record = JSON.parse(rawValue);
                results.push(record);
            } catch (err) {
                console.error(`!! Failed to parse record: ${rawValue}`);
            }
        }

        if (res.done) {
            console.log('--> Query iterator completed');
            await iterator.close();
            break;
        }
    }

    if (results.length === 0) {
        return JSON.stringify({
            message: `No patients found in hospital ${hospitalId}`,
        });
    }

    return JSON.stringify(results);
}

async function getAllClaimsByInsurance(ctx, args) {
    args = typeof args === "string" ? JSON.parse(args) : args;
    const { role } = getCallerAttributes(ctx);

    // Allow both agents and admin to query claims
    if (!["insuranceAdmin", "insuranceAgent", "insuranceCompany"].includes(role)) {
        throw new Error("Only insurance admin, insurance company or insurance agent can query claims");
    }

    if (!args.insuranceCompany) throw new Error("insuranceCompany is required");

    const query = {
        selector: {
            docType: "claim",
            insuranceCompany: args.insuranceCompany,
        },
    };

    const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    const claims = [];

    while (true) {
        const res = await iterator.next();
        if (res.value && res.value.value) {
            try {
                const record = JSON.parse(res.value.value.toString("utf8"));
                claims.push(record);
            } catch (err) {
                console.error("Failed to parse claim record:", err);
            }
        }
        if (res.done) {
            await iterator.close();
            break;
        }
    }

    return _stringify(claims);
}

async function getAllClaimsByPatient(ctx, args) {
    args = typeof args === "string" ? JSON.parse(args) : args;
    const { role, uuid } = getCallerAttributes(ctx);

    // Only patients can query their own claims
    if (role !== "patient") {
        throw new Error("Only patients can query their own claims");
    }

    // patientId comes from caller identity (uuid), not args (so patients can’t query others)
    const query = {
        selector: {
            docType: "claim",
            patientId: uuid,
        },
    };

    const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    const claims = [];

    while (true) {
        const res = await iterator.next();
        if (res.value && res.value.value) {
            try {
                const record = JSON.parse(res.value.value.toString("utf8"));
                claims.push(record);
            } catch (err) {
                console.error("Failed to parse claim record:", err);
            }
        }
        if (res.done) {
            await iterator.close();
            break;
        }
    }

    return _stringify(claims);
}



async function getReportsByPatientId(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;
    if (!args.patientId) throw new Error('patientId is required');

    // Reuse getAllRecordsByPatientId to fetch all records
    const recordsJSON = await getAllRecordsByPatientId(
        ctx,
        JSON.stringify({ patientId: args.patientId })
    );
    const records = JSON.parse(recordsJSON);

    // Filter only those that contain a lab report field
    const reports = records.filter((r) => r.labReport);

    return _stringify(reports);
}

async function getAllTreatmentHistory(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;
    if (!args.patientId) throw new Error('patientId is required');

    // Reuse existing function to fetch all records (diagnosis, prescription, reports, etc.)
    const recordsJSON = await getAllRecordsByPatientId(
        ctx,
        JSON.stringify({ patientId: args.patientId })
    );
    const records = JSON.parse(recordsJSON);

    // Optionally, sort by createdAt timestamp so history is chronological
    records.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return _stringify(records);
}

async function getRewardBalance(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;
    if (!args.patientId) throw new Error('patientId required');

    const caller = getCallerAttributes(ctx);
    // patient can see own balance; hospital/researcher/insurance admin can view as well per policy
    if (caller.role === 'patient' && caller.uuid !== args.patientId) {
        throw new Error('Patient can only view their own reward balance');
    }

    const rewardKey = ctx.stub.createCompositeKey('reward', [args.patientId]);
    const rewardBytes = await ctx.stub.getState(rewardKey);
    if (!rewardBytes || rewardBytes.length === 0)
        return _stringify({ patientId: args.patientId, balance: 0 });

    return rewardBytes.toString();
}

async function getAllPrescriptions(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;

    const { role: callerRole, uuid: callerId } = getCallerAttributes(ctx);

    const allowedRoles = [
        'researcher',
        'hospital',
        'pharmacy',
        'insuranceAdmin',
    ];
    if (!allowedRoles.includes(callerRole)) {
        throw new Error(
            'Only researchers, hospitals, pharmacies, or insurance admins can fetch prescriptions'
        );
    }

    const query = {
        selector: {
            docType: 'record',
            prescription: { $exists: true }, // fetch only records with prescription field
        },
    };

    const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    const prescriptions = [];
    while (true) {
        const res = await iterator.next();
        if (res.value && res.value.value.toString()) {
            const record = JSON.parse(res.value.value.toString());

            let canAccess = false;

            if (
                callerRole === 'researcher' ||
                callerRole === 'insuranceAdmin'
            ) {
                const consentKey = ctx.stub.createCompositeKey('consent', [
                    record.patientId,
                    callerId,
                ]);
                const consentBytes = await ctx.stub.getState(consentKey);
                if (consentBytes && consentBytes.length > 0) {
                    const consent = JSON.parse(consentBytes.toString());
                    if (consent.status === 'approved') {
                        canAccess = true;
                    }
                }
            } else {
                canAccess = true; // hospitals, pharmacies can access all
            }

            if (canAccess) prescriptions.push(record);
        }
        if (res.done) {
            await iterator.close();
            break;
        }
    }

    return _stringify(prescriptions);
}

async function getAllLabReports(ctx, args) {
    args = typeof args === 'string' ? JSON.parse(args) : args;

    const { role: callerRole, uuid: callerId } = getCallerAttributes(ctx);

    const allowedRoles = [
        'researcher',
        'hospital',
        'diagnostics',
        'insuranceAdmin',
    ];
    if (!allowedRoles.includes(callerRole)) {
        throw new Error(
            'Only researchers, hospitals, diagnostics, or insurance admins can fetch lab reports'
        );
    }

    const query = {
        selector: {
            docType: 'record',
            labReport: { $exists: true }, // fetch only records with labReport field
        },
    };

    const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    const reports = [];
    while (true) {
        const res = await iterator.next();
        if (res.value && res.value.value.toString()) {
            const report = JSON.parse(res.value.value.toString());

            let canAccess = false;

            if (
                callerRole === 'researcher' ||
                callerRole === 'insuranceAdmin'
            ) {
                const consentKey = ctx.stub.createCompositeKey('consent', [
                    report.patientId,
                    callerId,
                ]);
                const consentBytes = await ctx.stub.getState(consentKey);
                if (consentBytes && consentBytes.length > 0) {
                    const consent = JSON.parse(consentBytes.toString());
                    if (consent.status === 'approved') {
                        canAccess = true;
                    }
                }
            } else {
                canAccess = true; // hospitals, diagnostics can access all
            }

            if (canAccess) reports.push(report);
        }
        if (res.done) {
            await iterator.close();
            break;
        }
    }

    return _stringify(reports);
}

module.exports = {
    getPatientPrescription,
    getAllPatientsByDoctor,
    getAllDoctorsByHospital,
    getAllPatientsByHospital,
    getAllClaimsByInsurance,
    getReportsByPatientId,
    getAllTreatmentHistory,
    getRewardBalance,
    getAllPrescriptions,
    getAllLabReports,
    getAllPatientsWithRecordsByDoctor,
    getAllRecordsByPatientId,
    getAllClaimsByPatient,
};
