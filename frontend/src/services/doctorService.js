// services/doctorService.js
import api from "./api";

/**
 * Doctor Login
 */
export const doctorLogin = async (doctorId) => {
  try {
    const res = await api.post("/login", { doctorId });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Doctor login failed" };
  }
};

/**
 * Create Patient Record
 */
export const createPatientRecord = async ({ doctorId, patientId, diagnosis, prescription }) => {
  try {
    const res = await api.post("/doctor/patientRecord", {
      doctorId,
      patientId,
      diagnosis,
      prescription,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to create patient record" };
  }
};

/**
 * Update Patient Record
 */
export const updatePatientRecord = async ({ doctorId, recordId, patientId, diagnosis, prescription }) => {
  try {
    const res = await api.put("/doctor/patientRecord", {
      doctorId,
      recordId,
      patientId,
      diagnosis,
      prescription,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update patient record" };
  }
};

/**
 * Upload Patient Description
 */
export const uploadPatientDescription = async ({ doctorId, patientId, description }) => {
  try {
    const res = await api.post("/doctor/patientDescription", {
      doctorId,
      patientId,
      description,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to upload patient description" };
  }
};

/**
 * Get All Patients Treated by Doctor
 */
export const getPatientsByDoctor = async (doctorId) => {
  try {
    const res = await api.get(`/doctor/patients/${doctorId}`);
    console.log('Fetched patients:', res.data);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch patients" };
  }
};
