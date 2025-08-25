// routes/patient.js
'use strict';

const express = require('express');
const { invokeTransaction } = require('../invoke');
const { getQuery } = require('../query');

const router = express.Router();

/**
 * Grant access to a doctor
 */
router.post('/grantAccess', async (req, res) => {
    try {
        const { entityId, entityRole, patientId } = req.body;

        if (!entityId || !entityRole || !patientId) {
            return res.status(400).json({ error: 'userId, userRole, patientId and doctorIdToGrant are required' });
        }

        const args = { patientId, entityId, entityRole };
        const result = await invokeTransaction('grantAccess', args, patientId, "patient");
        res.json(result);
    } catch (error) {
        console.error('Error granting access to doctor:', error);
        res.status(500).json({ error: error.message });
    }
});


/**
 * Get patient prescription
 */
router.get('/prescriptions/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const args = { patientId };
        const result = await getQuery('getPatientPrescription', args, userId);
        res.json(result);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get patient lab reports
 */
router.get('/reports/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const args = { patientId };
        const result = await getQuery('getReportsByPatientId', args, userId);
        res.json(result);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get all treatment history
 */
router.get('/history/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const args = { patientId };
        const result = await getQuery('getAllTreatmentHistory', args, userId);
        res.json(result);
    } catch (error) {
        console.error('Error fetching treatment history:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Request a claim (patients only)
 */
router.post('/requestClaim', async (req, res) => {
    try {
        const { patientId, policyNumber, amount, reason } = req.body;

        if (!patientId || !policyNumber || !amount || !reason) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const args = { policyNumber, amount, reason };
        const result = await invokeTransaction('createClaim', args, patientId, 'patient');
        res.json(result);
    } catch (error) {
        console.error('Error requesting claim:', error);
        res.status(500).json({ error: error.message });
    }
});


/**
 * Get reward/token balance
 */
router.get('/rewards/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const args = { patientId };
        const result = await getQuery('getRewardBalance', args, userId);
        res.json(result);
    } catch (error) {
        console.error('Error fetching reward balance:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Use reward/token in treatment
 */
router.post('/useReward', async (req, res) => {
    try {
        const { userId, patientId, treatmentId, amount } = req.body;

        if (!userId || !patientId || !treatmentId || !amount) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const args = { patientId, treatmentId, amount };
        const result = await invokeTransaction('useReward', args, userId);
        res.json(result);
    } catch (error) {
        console.error('Error using reward:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
