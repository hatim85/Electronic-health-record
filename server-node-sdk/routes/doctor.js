// routes/doctor.js
'use strict';

const express = require('express');
const { invokeTransaction } = require('../invoke');
const { getQuery } = require('../query');
const { login } = require('../helper');

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
        const { doctorId, patientId, diagnosis, prescription } = req.body;

        if (!doctorId || !patientId) {
            return res.status(400).json({ error: 'doctorId, patientId are required' });
        }

        // prepare args for addRecord (doctorId comes from identity, not args)
        const args = { patientId, diagnosis, prescription: prescription || '' };

        const result = await invokeTransaction('addRecord', args, doctorId,'doctor');
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
        const { doctorId, recordId,patientId, diagnosis, prescription } = req.body;

        if (!doctorId || !recordId) {
            return res.status(400).json({ error: 'doctorId and recordId are required' });
        }

        const args = { doctorId, recordId, diagnosis: diagnosis,patientId, prescription: prescription || '' };
        const result = await invokeTransaction('updatePatientRecord', args, doctorId,'doctor');
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
        const { doctorId, patientId, description } = req.body;

        if (!doctorId || !patientId || !description) {
            return res.status(400).json({ error: 'doctorId, patientId, and description are required' });
        }

        const args = { doctorId, patientId, description };
        const result = await invokeTransaction('uploadPatientDescription', args, doctorId,'doctor');
        res.json(result);
    } catch (error) {
        console.error('Error uploading patient description:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get All Patients Treated by Doctor
 */
router.get('/patients/:doctorId', async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const args = { doctorId };
        const result = await getQuery('getAllPatientsWithRecordsByDoctor', args, doctorId);
        console.log('Patients with records:', result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching patients with records:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
