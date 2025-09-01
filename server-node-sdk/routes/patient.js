// routes/patient.js
'use strict';

const express = require('express');
const { invokeTransaction } = require('../utils/invoke');
const { getQuery } = require('../utils/query');

const router = express.Router();

/**
 * Grant access to a doctor
 */
router.post('/grantAccess', async (req, res) => {
    try {
        const { entityId, entityRole, userId, userRole } = req.body;
        const patientId = userId; 
        if (!entityId || !entityRole || !userId) {
            return res.status(400).json({ error: 'userId, userRole, patientId and doctorIdToGrant are required' });
        }

        const args = { userId, entityId, entityRole, patientId };
        const result = await invokeTransaction('grantAccess', args, userId, userRole);
        res.json(result);
    } catch (error) {
        console.error('Error granting access to doctor:', error);
        res.status(500).json({ error: error.message });
    }
});


/**
 * Get patient prescription
 */
router.get('/prescriptions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const args = { patientId: userId };
        const result = await getQuery('getPatientPrescription', args, userId,'Org1');
        res.json(result);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get patient lab reports
 */
router.get('/reports/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const args = { patientId:userId };
        const result = await getQuery('getReportsByPatientId', args, userId,'Org1');
        res.json(result);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get all treatment history
 */
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const args = { patientId:userId };
        const result = await getQuery('getAllTreatmentHistory', args, userId,'Org1');
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
        const { userId, userRole, policyNumber, amount, reason } = req.body;

        if (!userId || !policyNumber || !amount || !reason) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const args = { policyNumber, amount, reason };
        const result = await invokeTransaction('createClaim', args, userId, userRole);
        res.json(result);
    } catch (error) {
        console.error('Error requesting claim:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get all claims for a patient
 */
router.get('/claims/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const args = { patientId:userId };
        const result = await getQuery('getAllClaimsByPatient', args, userId,'Org2');
        res.json(result);
    } catch (error) {
        console.error('Error fetching patient claims:', error);
        res.status(500).json({ error: error.message });
    }
});


/**
 * Get reward/token balance
 */
router.get('/rewards/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const args = { patientId:userId };
        const result = await getQuery('getRewardBalance', args, userId,'Org1');
        res.json(result);
    } catch (error) {
        console.error('Error fetching reward balance:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
