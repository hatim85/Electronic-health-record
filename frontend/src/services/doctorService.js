// services/doctorService.js
import api from "./api";
import { getUserId, getUserRole } from "../context/authUser";

const userId=getUserId();
const userRole=getUserRole();
/**
 * Doctor Login
 */
export const doctorLogin = async (doctorId) => {
  try {
    const res = await api.post("/login", { userId, userRole});
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Doctor login failed" };
  }
};

/**
 * Create Patient Record
 */
export const createPatientRecord = async ({ patientId, diagnosis, prescription }) => {
  try {
    const res = await api.post("/doctor/patientRecord", {
      userId,
      userRole,
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
export const updatePatientRecord = async ({ recordId, patientId, diagnosis, prescription }) => {
  try {
    const res = await api.put("/doctor/patientRecord", {
      userId,
      userRole,
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
export const uploadPatientDescription = async ({ patientId, description }) => {
  try {
    const res = await api.post("/doctor/patientDescription", {
      userId,
      userRole,
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
export const getPatientsByDoctor = async () => {
  try {
    const res = await api.get(`/doctor/patients/${userId}`);
    console.log('Fetched patients:', res.data);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch patients" };
  }
};
