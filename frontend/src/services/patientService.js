import api from "./api";
import { userId, userRole } from "../context/authUser";
// 🔹 Grant access (to doctor/hospital/insurance)
export const grantAccess = async ({ entityId, entityRole }) => {
  try {
    const res = await api.post("/patient/grantAccess", {
      userId,
      userRole,
      entityId,
      entityRole,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to grant access" };
  }
};

// 🔹 View prescriptions
export const getMyPrescriptions = async () => {
  try {
    const res = await api.get(`/patient/prescriptions/${userId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch prescriptions" };
  }
};

// 🔹 View lab reports
export const getMyReports = async () => {
  try {
    const res = await api.get(`/patient/reports/${userId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch reports" };
  }
};

// 🔹 View treatment history
export const getMyHistory = async () => {
  try {
    const res = await api.get(`/patient/history/${userId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch history" };
  }
};

// 🔹 Request insurance claim
export const requestClaim = async ({ policyNumber, amount, reason }) => {
  try {
    const res = await api.post("/patient/requestClaim", {
      userId,
      userRole,
      policyNumber,
      amount,
      reason,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to request claim" };
  }
};

// 🔹 View reward points
export const getMyRewards = async () => {
  try {
    const res = await api.get(`/patient/rewards/${userId}`);
    console.log("res:", res);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch rewards" };
  }
};

// 🔹 View my claims
export const getMyClaims = async () => {
  try {
    const res = await api.get(`/patient/claims/${userId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch claims" };
  }
};