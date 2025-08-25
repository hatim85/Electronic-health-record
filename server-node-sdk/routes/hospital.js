'use strict';

const express = require('express');
const { invokeTransaction } = require('../invoke');
const { getQuery } = require('../query');
const { login, registerUser } = require('../helper');
const { Wallets } = require('fabric-network');
const path = require('path');
const { deleteIdentity } = require('../utils/deleteIdentity');

const router = express.Router();

/**
 * Hospital Login
 */
router.post('/login', async (req, res) => {
    try {
        const { hospitalId } = req.body;
        console.log("hospitalId: ",hospitalId);
        if (!hospitalId) {
            return res.status(400).json({ error: 'hospitalId is required' });
        }
        // Try to login, if not found, onboard
        let loginRes = await login(hospitalId, 'hospital');
        res.json(loginRes);
    } catch (error) {
        console.error('Hospital login error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { hospitalId, name, city } = req.body;
        if (!hospitalId || !name || !city) {
            return res.status(400).json({ error: 'hospitalId, name, and city are required' });
        }

        // Call registerUser with correct parameters
        const registerRes = await registerUser(
            "hospitalAdmin",  // adminID (identity already in wallet)
            hospitalId,   // userID
            "hospital",   // userRole
            {
                hospitalName: name, // matches your args object in helper.js
                city: city
            }
        );

        res.json(registerRes);
    } catch (error) {
        console.error('Hospital register error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Register a new patient (Hospital Admin adds patient)
 */
router.post('/patient', async (req, res) => {
    try {
        const { hospitalId, patientId, name, dob, gender, city } = req.body;

        if (!hospitalId || !patientId || !name || !dob || !gender) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const args = { hospitalId, patientId, name, dob, gender, city };

        // Register and enroll patient using CA (and also create patient profile in chaincode)
        const result = await registerUser(
            'hospitalAdmin',    // admin identity
            patientId,          // patient unique ID
            'patient',          // userRole
            args
        );

        res.json({
            message: 'Patient registered successfully with wallet identity and chaincode profile',
            result
        });
    } catch (error) {
        console.error('Error registering patient:', error);
        res.status(500).json({ error: error.message });
    }
});


/**
 * Register a new doctor (Hospital Admin adds doctor)
 */
router.post('/doctor', async (req, res) => {
    try {
        const { hospitalId, doctorId, name, specialization, city } = req.body;
        if (!hospitalId || !doctorId || !name || !specialization) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await registerUser(
            'hospitalAdmin',    // enrollId (the admin who registers)
            doctorId,           // userID
            'doctor',           // userRole
            {                   // args
                name,
                specialization,
                hospitalId,
                city
            }
        );

        res.json({
            message: 'Doctor registered successfully with wallet identity and chaincode profile',
            result
        });
    } catch (error) {
        console.error('Error registering doctor:', error);
        res.status(500).json({ error: error.message });
    }
});



/**
 * Update Doctor Profile
 */
router.put('/doctor/:doctorId', async (req, res) => {       //Not working: Expected 5 parameters, but 1 have been supplied
    try {
        const { hospitalId, name, specialization, city } = req.body;
        const doctorId = req.params.doctorId;

        if (!hospitalId || !doctorId) {
            return res.status(400).json({ error: 'hospitalId and doctorId are required' });
        }

        const args = { hospitalId, doctorId, name, specialization, city };
        const result= await invokeTransaction('updateDoctorProfile', args, hospitalId,'hospital');
        res.json({ message: 'Doctor profile updated successfully', result });
    } catch (error) {
        console.error('Error updating doctor profile:', error);
        res.status(500).json({ error: error.message });
    }
});


/**
 * Delete Doctor Profile
 */
router.delete('/doctor/:doctorId', async (req, res) => {
    try {
        const { hospitalId } = req.body;
        const doctorId = req.params.doctorId;

        if (!hospitalId || !doctorId) {
            return res.status(400).json({ error: 'hospitalId and doctorId are required' });
        }

        // Step 1: Delete from chaincode
        const args = { hospitalId, doctorId };
        const chaincodeRes = await invokeTransaction(
            'deleteDoctorProfile',
            args,
            hospitalId,
            'hospital'
        );

        if (chaincodeRes && chaincodeRes.success) {
            // Step 2: Delete wallet + revoke identity
            await deleteIdentity(doctorId);

            return res.json({
                message: 'Doctor profile deleted successfully (chaincode + CA + wallet)',
                chaincodeRes
            });
        } else {
            return res.status(500).json({
                error: 'Failed to delete doctor profile from chaincode',
                chaincodeRes
            });
        }
    } catch (error) {
        console.error('Error deleting doctor profile:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get All Doctors in a Hospital
 */
router.get('/doctors/:hospitalId', async (req, res) => {
    try {
        const hospitalId = req.params.hospitalId;
        const args = { hospitalId };
        const result = await getQuery('getAllDoctorsByHospital', args, hospitalId);
        res.json(result);
    } catch (error) {
        console.error('Error getting doctors:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get All Patients in a Hospital
 */
router.get('/patients/:hospitalId', async (req, res) => {
    try {
        const hospitalId = req.params.hospitalId;
        const args = { hospitalId };
        const result = await getQuery('getAllPatientsByHospital', args, hospitalId);
        res.json(result);
    } catch (error) {
        console.error('Error getting patients:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Register a new Diagnostics Center
 */
router.post('/diagnostic', async (req, res) => {
    try {
        const { hospitalId, diagnosticsId, name, city } = req.body;

        if (!hospitalId || !diagnosticsId || !name) {
            return res.status(400).json({ error: 'hospitalId, diagnosticsId, and name are required' });
        }

        // Step 1: Register CA identity for diagnostic center
        const registerRes = await registerUser(
            'hospitalAdmin',     // admin identity
            diagnosticsId,       // userID (wallet identity for diagnostics center)
            'diagnostics', // userRole
            { hospitalId, name, city, diagnosticsId }
        );

        console.log(`Diagnostics center registered with wallet identity: ${JSON.stringify(registerRes)}`);

        res.json({
            message: 'Diagnostics center registered successfully with wallet identity and chaincode profile',
            registerRes
        });
    } catch (error) {
        console.error('Error registering diagnostics center:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Register a new Pharmacy
 */
router.post('/pharmacy', async (req, res) => {
    try {
        const { hospitalId, pharmacyId, name, city } = req.body;

        if (!hospitalId || !pharmacyId || !name) {
            return res.status(400).json({ error: 'hospitalId, pharmacyId, and name are required' });
        }

        // Step 1: Register CA identity
        const registerRes = await registerUser(
            'hospitalAdmin',
            pharmacyId,
            'pharmacy',
            { hospitalId, name, city }
        );

        res.json({
            message: 'Pharmacy registered successfully with wallet identity and chaincode profile',
            registerRes
        });
    } catch (error) {
        console.error('Error registering pharmacy:', error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
