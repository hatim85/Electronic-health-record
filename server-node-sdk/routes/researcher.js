// routes/researchers.js
'use strict';

const express = require('express');
const { getQuery } = require('../utils/query');
const { invokeTransaction } = require('../utils/invoke');
const { registerUser } = require('../utils/helper');

const router = express.Router();

/**
 * Register and onboard a researcher
 * Only researchAdmin from Org2 can do this
 */
router.post('/register', async (req, res) => {
    try {
        const { userId, userRole, researcherId, name, institution } = req.body;

        if (!researcherId || !name || !institution) {
            return res.status(400).json({ error: 'researcherId, name, and institution are required' });
        }

        // Step 1: Register researcher identity in CA (Org2)
        const registerRes = await registerUser(
            userId,    // admin identity (Org2)
            researcherId,       // user ID
            'researcher',       // user role
            { name, institution }
        );

        res.json({
            message: 'Researcher registered successfully with wallet identity and chaincode profile',
            registerRes
        });
    } catch (error) {
        console.error('Error registering researcher:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get ALL patient prescription data
 */
router.get('/prescriptions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'researcherId is required' });
        }

        const args = {};
        const result = await getQuery('getAllPrescriptions', args, userId,'Org1');
        res.json(result);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
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
 * Process Data (store analytics results)
 */
router.post('/processData', async (req, res) => {
    try {
        const { userId,userRole, datasetType, resultSummary } = req.body;

        if (!userId || !datasetType || !resultSummary) {
            return res.status(400).json({ error: 'researcherId, datasetType, and resultSummary are required' });
        }

        const args = { datasetType, resultSummary };
        const result = await invokeTransaction('storeResearchResult', args, userId,userRole);
        res.json(result);
    } catch (error) {
        console.error('Error storing research result:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
