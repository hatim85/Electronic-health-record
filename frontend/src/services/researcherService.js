// services/researcherService.js
import { getUserId, getUserRole } from "../context/authUser";
import api from "./api";
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
      userId: getUserId(),
      userRole: getUserRole(),
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
    const res = await api.get(`/researcher/prescriptions/${getUserId()}`);
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
    const res = await api.get(`/researcher/labReports/${getUserId()}`);
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
      userId: getUserId(),
      userRole: getUserRole(),
      datasetType,
      resultSummary,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to process research data" };
  }
};
