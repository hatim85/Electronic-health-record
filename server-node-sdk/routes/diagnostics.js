// routes/diagnostics.js
'use strict';

const express = require('express');
const { invokeTransaction } = require('../invoke');
const { getQuery } = require('../query');

const router = express.Router();

/**
 * Get Patient Prescription by Patient ID
 */
router.get('/prescription/:labId/:patientId', async (req, res) => {
    try {
        const { labId, patientId } = req.params;

        if (!labId || !patientId) {
            return res.status(400).json({ error: 'labId and patientId are required' });
        }

        const args = { patientId };
        const result = await getQuery('getPatientPrescription', args, labId);
        res.json(result);
    } catch (error) {
        console.error('Error fetching patient prescription:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Upload Patient Lab Report
 */
router.post('/labReport', async (req, res) => {
    try {
        const { labId, patientId, reportType, reportData } = req.body;

        if (!labId || !patientId || !reportType || !reportData) {
            return res.status(400).json({ error: 'labId, patientId, reportType, and reportData are required' });
        }

        const args = { labId, patientId, reportType, reportData };
        const result = await invokeTransaction('uploadLabReport', args, labId, 'diagnostics');
        res.json(result);
    } catch (error) {
        console.error('Error uploading lab report:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
