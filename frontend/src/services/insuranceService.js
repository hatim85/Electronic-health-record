// services/insuranceService.js
import api from "./api";
import { getUserId, getUserRole } from "../context/authUser";

const userId=getUserId();
const userRole=getUserRole();
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
  console.log("userId: ",userId," userRole: ",userRole," in service");
  try {
    const res = await api.post("/insurance/register", {
      userId,
      userRole,
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
  patientId,
  policyNumber,
  coverageAmount,
  insuranceCompany,
}) => {
  try {
    const res = await api.post("/insurance/issue", {
      userId,
      userRole,
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
export const getClaimsByInsuranceCompany = async () => {
  try {
    const res = await api.get(`/insurance/claims/${userId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch claims" };
  }
};

/**
 * Approve a Claim for a Patient
 */
export const approveClaim = async ({ claimId, patientId }) => {
  try {
    const res = await api.post("/insurance/approveClaim", {
      userId,
      userRole,
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
  console.log("userId: ",userId," userRole: ",userRole," in service");
  try {
    const res = await api.post("/insurance/onboard", {
      userId,
      userRole,
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
