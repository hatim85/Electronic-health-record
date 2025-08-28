// services/insuranceService.js
import api from "./api";

/**
 * Register Insurance Agent
 * Only insuranceAdmin can do this
 */
export const registerInsuranceAgent = async ({
  agentId,
  insuranceCompany,
  name,
  city,
}) => {
  try {
    const res = await api.post("/insurance/register", {
      agentId,
      insuranceCompany,
      name,
      city,
    });
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || { error: "Failed to register insurance agent" }
    );
  }
};

/**
 * Issue Insurance Policy for a Patient
 */
export const issueInsurance = async ({
  insuranceId,
  patientId,
  policyNumber,
  coverageAmount,
  insuranceCompany,
}) => {
  try {
    const res = await api.post("/insurance/issue", {
      insuranceId,
      patientId,
      policyNumber,
      coverageAmount,
      insuranceCompany,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to issue insurance" };
  }
};

/**
 * Get All Claims for an Insurance Company
 */
export const getClaimsByInsuranceCompany = async (insuranceCompany) => {
  try {
    const res = await api.get(`/insurance/claims/${insuranceCompany}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch claims" };
  }
};

/**
 * Approve a Claim for a Patient
 */
export const approveClaim = async ({ insuranceId, claimId, patientId }) => {
  try {
    const res = await api.post("/insurance/approveClaim", {
      insuranceId,
      claimId,
      patientId,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to approve claim" };
  }
};

/** Register Insurance Company
 * Only insuranceAdmin can do this
 */
export const registerInsuranceCompany = async ({
  companyId,
  name,
  city,
}) => {
  try {
    const res = await api.post("/insurance/onboard", {
      companyId,
      name,
      city,
    });
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || { error: "Failed to register insurance company" }
    );
  }
}
