// services/diagnosticsService.js
import axios from "axios";

const API_BASE = "http://localhost:3000/api/v1/diagnostics"; // adjust if different

/**
 * Get Patient Prescription by Patient ID
 */
export const getPatientPrescription = async (labId, patientId) => {
  try {
    const res = await axios.get(`${API_BASE}/prescription/${labId}/${patientId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch patient prescription" };
  }
};

/**
 * Upload Patient Lab Report
 */
export const uploadLabReport = async ({ labId, patientId, reportType, reportData }) => {
  try {
    const res = await axios.post(`${API_BASE}/labReport`, {
      labId,
      patientId,
      reportType,
      reportData,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to upload lab report" };
  }
};
