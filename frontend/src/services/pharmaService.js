// services/pharmaService.js
import api from "./api";
import { getUserId, getUserRole } from "../context/authUser";
/**
 * Get patient prescription from pharmacy by patientId
 */
export const getPatientPrescription = async (patientId) => {
  try {
    const res = await api.get(`/pharmacy/prescription/${getUserId()}/${patientId}`);
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
      userId: getUserId(),
      userRole: getUserRole(),
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
      userId: getUserId(),
      userRole: getUserRole(),
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
