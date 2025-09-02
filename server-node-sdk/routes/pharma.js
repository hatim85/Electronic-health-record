// routes/pharma.js
'use strict';

const express = require('express');
const { getQuery } = require('../utils/query');
const { invokeTransaction } = require('../utils/invoke');

const router = express.Router();

/**
 * Get patient prescription by patientId
 */
router.get('/prescription/:userId/:patientId', async (req, res) => {
    try {
        const { userId, patientId } = req.params;

        if (!userId || !patientId) {
            return res.status(400).json({ error: 'pharmacyId and patientId are required' });
        }

        const args = { patientId };
        const result = await getQuery('getPatientPrescription', args, userId,'Org1');
        res.json(result);
    } catch (error) {
        console.error('Error fetching prescription:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Update key medicine stock
 */
router.post('/updateStock', async (req, res) => {
    try {
        const { userId, userRole, medicineName, newStock } = req.body;

        if (!userId || !medicineName || newStock == null) {
            return res.status(400).json({ error: 'pharmacyId, medicineName, and newStock are required' });
        }

        const args = { medicineName, newStock };
        const result = await invokeTransaction('updateMedicineStock', args, userId,userRole);
        res.json(result);
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Dispense medicine to a patient
 */
router.post('/dispense', async (req, res) => {
    try {
        const { userId, userRole, patientId, recordId, medicineName, quantity } = req.body;

        // Validate inputs
        if (!patientId || !recordId || !medicineName || !quantity) {
            return res.status(400).json({
                error: 'pharmacyId, patientId, recordId, medicineName, and quantity are required'
            });
        }

        // Build args for chaincode
        const args = { patientId, recordId, medicineName, quantity };

        // Call chaincode with pharmacy identity
        const result = await invokeTransaction('dispenseMedicine', args, userId, userRole);

        res.json(result);
    } catch (error) {
        console.error('Error dispensing medicine:', error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
