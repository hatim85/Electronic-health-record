// services/pharmaService.js
import api from "./api";
import { getUserId, getUserRole } from "../context/authUser";

const userId=getUserId();
const userRole=getUserRole();
/**
 * Get patient prescription from pharmacy by patientId
 */
export const getPatientPrescription = async (patientId) => {
  try {
    const res = await api.get(`/pharmacy/prescription/${userId}/${patientId}`);
    console.log("res:", res);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch prescription" };
  }
};

/**
 * Update stock of a medicine in pharmacy
 */
export const updateMedicineStock = async ({ medicineName, newStock }) => {
  try {
    const res = await api.post("/pharmacy/updateStock", {
      userId,
      userRole,
      medicineName,
      newStock,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update medicine stock" };
  }
};

/**
 * Dispense medicine to patient
 */
export const dispenseMedicine = async ({ patientId, recordId, medicineName, quantity }) => {
  try {
    const res = await api.post("/pharmacy/dispense", {
      userId,
      userRole,
      patientId,
      recordId,
      medicineName,
      quantity,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to dispense medicine" };
  }
};
