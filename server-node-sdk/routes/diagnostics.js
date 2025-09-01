// routes/diagnostics.js
'use strict';

const express = require('express');
const { invokeTransaction } = require('../utils/invoke');
const { getQuery } = require('../utils/query');

const router = express.Router();

/**
 * Get Patient Prescription by Patient ID
 */
router.get('/prescription/:userId/:patientId', async (req, res) => {
    try {
        const { userId, patientId } = req.params;

        if (!userId || !patientId) {
            return res.status(400).json({ error: 'userId and patientId are required' });
        }

        const args = { patientId };
        const result = await getQuery('getPatientPrescription', args, userId,'Org1');
        res.json(result);
    } catch (error) {
        console.error('Error fetching patient prescription:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get ALL patient lab reports
 */
router.get('/labReports/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'researcherId is required' });
        }

        const args = {};
        const result = await getQuery('getAllLabReports', args, userId,'Org2');
        res.json(result);
    } catch (error) {
        console.error('Error fetching lab reports:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Upload Patient Lab Report
 */
router.post('/labReport', async (req, res) => {
    try {
        console.log("req body:", req.body);
        const { userId, userRole, patientId, reportType, reportData } = req.body;

        if (!userId || !patientId || !reportType || !reportData) {
            return res.status(400).json({ error: 'userId, patientId, reportType, and reportData are required' });
        }

        const args = { userId, patientId, reportType, reportData };
        const result = await invokeTransaction('uploadLabReport', args, userId, userRole);
        res.json(result);
    } catch (error) {
        console.error('Error uploading lab report:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
