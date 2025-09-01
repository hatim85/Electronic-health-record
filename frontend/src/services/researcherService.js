// services/researcherService.js
import api from "./api";
import { userId, userRole } from "../context/authUser";
/**
 * Register a new researcher
 */
export const registerResearcher = async ({
  researcherId,
  name,
  institution,
}) => {
  try {
    const res = await api.post("/researcher/register", {
      userId,
      userRole,
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
export const getAllPrescriptions = async () => {
  try {
    const res = await api.get(`/researcher/prescriptions/${userId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch prescriptions" };
  }
};

/**
 * Fetch all lab reports (accessible to researchers)
 */
export const getAllLabReports = async () => {
  try {
    const res = await api.get(`/researcher/labReports/${userId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch lab reports" };
  }
};

/**
 * Store processed research data (analytics results)
 */
export const processResearchData = async ({
  datasetType,
  resultSummary,
}) => {
  try {
    const res = await api.post("/researcher/processData", {
      userId,
      userRole,
      datasetType,
      resultSummary,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to process research data" };
  }
};
