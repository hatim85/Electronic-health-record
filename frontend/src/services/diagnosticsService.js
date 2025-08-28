// services/diagnosticsService.js
import api from "./api";

/**
 * Get Patient Prescription by Patient ID
 */
export const getPatientPrescription = async (labId, patientId) => {
  try {
    const res = await api.get(`/diagnostics/prescription/${labId}/${patientId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch patient prescription" };
  }
};

export const getAllLabReports = async (labId) => {
  try {
    const res = await api.get(`/diagnostics/labReports/${labId}`);
    console.log("res:", res);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch lab reports" };
  }
};

/**
 * Upload Patient Lab Report
 */
export const uploadLabReport = async ({ labId, patientId, reportType, reportData }) => {
  try {
    const res = await api.post(`/diagnostics/labReport`, {
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
