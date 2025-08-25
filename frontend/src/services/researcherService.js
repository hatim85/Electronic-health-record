// services/researcherService.js
import api from "./api";

/**
 * Register a new researcher
 */
export const registerResearcher = async ({ researcherId, name, institution }) => {
  try {
    const res = await api.post("/register", {
      researcherId,
      name,
      institution,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to register researcher" };
  }
};

/**
 * Fetch all prescriptions (accessible to researchers)
 */
export const getAllPrescriptions = async (researcherId) => {
  try {
    const res = await api.get(`/prescriptions/${researcherId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch prescriptions" };
  }
};

/**
 * Fetch all lab reports (accessible to researchers)
 */
export const getAllLabReports = async (researcherId) => {
  try {
    const res = await api.get(`/labReports/${researcherId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch lab reports" };
  }
};

/**
 * Store processed research data (analytics results)
 */
export const processResearchData = async ({ researcherId, datasetType, resultSummary }) => {
  try {
    const res = await api.post("/processData", {
      researcherId,
      datasetType,
      resultSummary,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to process research data" };
  }
};
