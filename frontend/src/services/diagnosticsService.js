// services/diagnosticsService.js
import api from "./api";
import { getUserId, getUserRole } from "../context/authUser";
/**
 * Get Patient Prescription by Patient ID
 */
export const getPatientPrescription = async (patientId) => {
  try {
    const res = await api.get(`/diagnostics/prescription/${getUserId()}/${patientId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch patient prescription" };
  }
};

export const getAllLabReports = async () => {
  try {
    const res = await api.get(`/diagnostics/labReports/${getUserId()}`);
    console.log("res:", res);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch lab reports" };
  }
};

/**
 * Upload Patient Lab Report
 */
export const uploadLabReport = async ({ patientId, reportType, reportData }) => {
  try {
    const res = await api.post(`/diagnostics/labReport`, {
      userId: getUserId(),
      userRole: getUserRole(),
      patientId,
      reportType,
      reportData,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to upload lab report" };
  }
};
