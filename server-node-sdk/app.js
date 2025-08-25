'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import role-based routes
const hospitalRoutes = require('./routes/hospital');
const doctorRoutes = require('./routes/doctor');
const diagnosticsRoutes = require('./routes/diagnostics');
const researchersRoutes = require('./routes/researcher');
const pharmaRoutes = require('./routes/pharma');
const insuranceRoutes = require('./routes/insurance');
const patientRoutes = require('./routes/patient');
const authRoutes = require('./routes/auth');

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===== Routes =====
app.get('/', (req, res) => {
    res.json({
        message: 'EHR Blockchain API is running 🚀',
        version: '1.0.0'
    });
});

// Attach routes for each role
app.use('/api/v1/hospital', hospitalRoutes);
app.use('/api/v1/doctor', doctorRoutes);
app.use('/api/v1/diagnostics', diagnosticsRoutes);
app.use('/api/v1/researchers', researchersRoutes);
app.use('/api/v1/pharmacy', pharmaRoutes);
app.use('/api/v1/insurance', insuranceRoutes);
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/auth',authRoutes);

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack || err);
    res.status(500).json({
        error: 'Something went wrong!',
        details: err.message
    });
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ EHR Blockchain API listening on port ${PORT}`);
});

module.exports = app;
