// services/pharmaService.js
import api from "./api";

/**
 * Get patient prescription from pharmacy by patientId
 */
export const getPatientPrescription = async (pharmacyId, patientId) => {
  try {
    const res = await api.get(`/prescription/${pharmacyId}/${patientId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch prescription" };
  }
};

/**
 * Update stock of a medicine in pharmacy
 */
export const updateMedicineStock = async ({ pharmacyId, medicineName, newStock }) => {
  try {
    const res = await axios.post("/updateStock", {
      pharmacyId,
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
export const dispenseMedicine = async ({ pharmacyId, patientId, recordId, medicineName, quantity }) => {
  try {
    const res = await axios.post("/dispense", {
      pharmacyId,
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
