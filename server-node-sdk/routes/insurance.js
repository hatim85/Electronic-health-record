'use strict';

const express = require('express');
const { invokeTransaction } = require('../invoke');
const { getQuery } = require('../query');
const { registerUser } = require('../helper');

const router = express.Router();

/**
 * Register and onboard an insurance agent
 * Only insuranceAdmin (Org2) can do this
 */
router.post('/register', async (req, res) => {
    try {
        const { agentId, insuranceCompany, name, city } = req.body;

        if (!agentId || !insuranceCompany || !name || !city) {
            return res.status(400).json({ error: 'agentId, insuranceCompany, name, and city are required' });
        }

        // Register insurance agent identity in CA (Org2)
        const registerRes = await registerUser(
            'insuranceAdmin',   // Org2 admin handles registration
            agentId,            // user ID
            'insuranceAgent',   // role
            { insuranceCompany, name, city }
        );

        res.json({
            message: 'Insurance agent registered successfully with wallet identity and chaincode profile',
            registerRes
        });
    } catch (error) {
        console.error('Error registering insurance agent:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Issue insurance for a patient
 * Both insurance agent and insurance admin can do this
 */
router.post('/issue', async (req, res) => {
    try {
        const { insuranceId, patientId, policyNumber, coverageAmount, insuranceCompany } = req.body;

        if (!insuranceId || !patientId || !policyNumber || !coverageAmount || !insuranceCompany) {
            return res.status(400).json({ error: 'insuranceId, patientId, policyNumber, coverageAmount, and insuranceCompany are required' });
        }

        const args = { insuranceId, patientId, policyNumber, coverageAmount, insuranceCompany };

        // Use the invoking user's identity (agent or admin)
        const result = await invokeTransaction('issueInsurance', args, insuranceId, 'insuranceAgent');
        res.json(result);
    } catch (error) {
        console.error('Error issuing insurance:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get all claims for an insurance company
 */
router.get('/claims/:insuranceCompany', async (req, res) => {
    try {
        const { insuranceCompany } = req.params;
        const args = { insuranceCompany };

        const result = await getQuery('getAllClaimsByInsurance', args, insuranceCompany);
        res.json(result);
    } catch (error) {
        console.error('Error fetching claims:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Approve claim based on patient
 */
router.post('/approveClaim', async (req, res) => {
    try {
        const { insuranceId, claimId, patientId } = req.body;

        if (!insuranceId || !claimId || !patientId) {
            return res.status(400).json({ error: 'insuranceId, claimId, and patientId are required' });
        }

        const args = { claimId, patientId };
        const result = await invokeTransaction('approveClaim', args, insuranceId, 'insuranceAdmin');
        res.json(result);
    } catch (error) {
        console.error('Error approving claim:', error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
