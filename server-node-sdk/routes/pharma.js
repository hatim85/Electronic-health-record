// routes/pharma.js
'use strict';

const express = require('express');
const { getQuery } = require('../query');
const { invokeTransaction } = require('../invoke');

const router = express.Router();

/**
 * Get patient prescription by patientId
 */
router.get('/prescription/:pharmacyId/:patientId', async (req, res) => {
    try {
        const { pharmacyId, patientId } = req.params;

        if (!pharmacyId || !patientId) {
            return res.status(400).json({ error: 'pharmacyId and patientId are required' });
        }

        const args = { patientId };
        const result = await getQuery('getPatientPrescription', args, pharmacyId);
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
        const { pharmacyId, medicineName, newStock } = req.body;

        if (!pharmacyId || !medicineName || newStock == null) {
            return res.status(400).json({ error: 'pharmacyId, medicineName, and newStock are required' });
        }

        const args = { medicineName, newStock };
        const result = await invokeTransaction('updateMedicineStock', args, pharmacyId,'pharmacy');
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
        const { pharmacyId, patientId, recordId, medicineName, quantity } = req.body;

        // Validate inputs
        if (!pharmacyId || !patientId || !recordId || !medicineName || !quantity) {
            return res.status(400).json({
                error: 'pharmacyId, patientId, recordId, medicineName, and quantity are required'
            });
        }

        // Build args for chaincode
        const args = { patientId, recordId, medicineName, quantity };

        // Call chaincode with pharmacy identity
        const result = await invokeTransaction('dispenseMedicine', args, pharmacyId, 'pharmacy');

        res.json(result);
    } catch (error) {
        console.error('Error dispensing medicine:', error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
