import api from "./api";

// 🔹 Grant access (to doctor/hospital/insurance)
export const grantAccess = async ({ patientId, entityId, entityRole }) => {
  try {
    const res = await api.post("/patient/grantAccess", {
      patientId,
      entityId,
      entityRole,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to grant access" };
  }
};

// 🔹 View prescriptions
export const getMyPrescriptions = async ({ patientId, userId }) => {
  try {
    const res = await api.get(`/patient/prescriptions/${patientId}`, {
      params: { userId }, // axios allows sending body in GET if passed in config.data
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch prescriptions" };
  }
};

// 🔹 View lab reports
export const getMyReports = async ({ patientId, userId }) => {
  try {
    const res = await api.get(`/patient/reports/${patientId}`, {
      params: { userId },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch reports" };
  }
};

// 🔹 View treatment history
export const getMyHistory = async ({ patientId, userId }) => {
  try {
    console.log("Service: Fetching history for patientId:", patientId, "by userId:", userId);
    const res = await api.get(`/patient/history/${patientId}`, {
      params: { userId },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch history" };
  }
};

// 🔹 Request insurance claim
export const requestClaim = async ({ patientId, policyNumber, amount, reason }) => {
  try {
    const res = await api.post("/patient/requestClaim", {
      patientId,
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
export const getMyRewards = async ({ patientId, userId }) => {
  try {
    const res = await api.get(`/patient/rewards/${patientId}`, {
      params: { userId },
    });
    console.log("res:", res);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch rewards" };
  }
};

// 🔹 View my claims
export const getMyClaims = async ({ patientId, userId }) => {
  try {
    const res = await api.get(`/patient/claims/${patientId}`, {
      params: { userId },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch claims" };
  }
};


// 🔹 Use reward points for treatment
export const useReward = async ({ userId, patientId, treatmentId, amount }) => {
  try {
    const res = await api.post("/patient/useReward", {
      userId,
      patientId,
      treatmentId,
      amount,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to use reward" };
  }
};
