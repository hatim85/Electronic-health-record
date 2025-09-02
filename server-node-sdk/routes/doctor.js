// routes/doctor.js
'use strict';

const express = require('express');
const { invokeTransaction } = require('../utils/invoke');
const { getQuery } = require('../utils/query');
const { login } = require('../utils/helper');

const router = express.Router();

/**
 * Doctor Login
 */
router.post('/login', async (req, res) => {
    try {
        const { doctorId } = req.body;
        if (!doctorId) {
            return res.status(400).json({ error: 'doctorId is required' });
        }
        const loginRes = await login(doctorId,'doctor');
        res.json(loginRes);
    } catch (error) {
        console.error('Doctor login error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Create Patient Record
 */
router.post('/patientRecord', async (req, res) => {
    try {
        const { userId, userRole, patientId, diagnosis, prescription } = req.body;

        if (!userId || !patientId) {
            return res.status(400).json({ error: 'doctorId, patientId are required' });
        }

        // prepare args for addRecord (doctorId comes from identity, not args)
        const args = { patientId, diagnosis, prescription: prescription || '' };

        const result = await invokeTransaction('addRecord', args, userId,userRole);
        res.json(result);
    } catch (error) {
        console.error('Error creating patient record:', error);
        res.status(500).json({ error: error.message });
    }
});


/**
 * Update Patient Record
 */
router.put('/patientRecord', async (req, res) => {
    try {
        const { userId, userRole, recordId, patientId, diagnosis, prescription } = req.body;

        if (!userId || !recordId) {
            return res.status(400).json({ error: 'userId and recordId are required' });
        }

        const args = { doctorId:userId, recordId, diagnosis: diagnosis,patientId, prescription: prescription || '' };
        const result = await invokeTransaction('updatePatientRecord', args, userId, userRole);
        res.json(result);
    } catch (error) {
        console.error('Error updating patient record:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Upload Patient Description
 */
router.post('/patientDescription', async (req, res) => {
    try {
        const { userId, userRole, patientId, description } = req.body;

        if (!userId || !patientId || !description) {
            return res.status(400).json({ error: 'doctorId, patientId, and description are required' });
        }

        const args = { userId, patientId, description };
        const result = await invokeTransaction('uploadPatientDescription', args, userId,userRole);
        res.json(result);
    } catch (error) {
        console.error('Error uploading patient description:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get All Patients Treated by Doctor
 */
router.get('/patients/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const args = { doctorId:userId };
        const result = await getQuery('getAllPatientsWithRecordsByDoctor', args, userId,'Org1');
        console.log('Patients with records:', result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching patients with records:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
