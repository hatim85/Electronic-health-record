import api from "./api";
import { getUserId, getUserRole } from "../context/authUser";

const userId=getUserId();
const userRole=getUserRole();
// ============================
// HOSPITAL SERVICE (matches backend routes)
// ============================


// 🔹 Login Hospital
export const loginHospital = async (hospitalId) => {
  try {
    const res = await api.post("/hospital/login", { hospitalId,userId,userRole });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Hospital login failed" };
  }
};

// 🔹 Register Hospital
export const registerHospital = async ({ hospitalId, name, city }) => {
  try {
    const res = await api.post("/hospital/register", {
      hospitalId,
      name,
      city,
      userId,
      userRole
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Hospital registration failed" };
  }
};

// 🔹 Register Patient (by hospital admin)
export const registerPatient = async ({
  hospitalId,
  patientId,
  name,
  dob,
  gender,
  city,
}) => {
  try {
    const res = await api.post("/hospital/patient", {
      hospitalId,
      patientId,
      name,
      dob,
      gender,
      city,
      userId,
      userRole
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Patient registration failed" };
  }
};

// 🔹 Register Doctor
export const registerDoctor = async ({
  hospitalId,
  doctorId,
  name,
  specialization,
  city,
}) => {
  try {
    const res = await api.post("/hospital/doctor", {
      hospitalId,
      doctorId,
      name,
      specialization,
      city,
      userId,
      userRole
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Doctor registration failed" };
  }
};

// 🔹 Update Doctor Profile
export const updateDoctor = async ({
  doctorId,
  hospitalId,
  name,
  specialization,
  city,
}) => {
  try {
    const res = await api.put(`/hospital/doctor/${doctorId}`, {
      hospitalId,
      name,
      specialization,
      city,
      userId,
      userRole
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Doctor update failed" };
  }
};

// 🔹 Delete Doctor Profile
export const deleteDoctor = async ({ doctorId, hospitalId }) => {
  try {
    const res = await api.delete(`/hospital/doctor/${doctorId}`, {
      data: { hospitalId,userId,userRole }, // axios allows sending body with DELETE via `data`
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Doctor deletion failed" };
  }
};

// 🔹 Get all doctors in a hospital
export const getDoctorsByHospital = async () => {
  try {
    console.log("userId hospital for doctors: ",userId)
    const res = await api.get(`/hospital/doctors/${userId}`);
    console.log("res: ", res);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Fetching doctors failed" };
  }
};

// 🔹 Get all patients in a hospital
export const getPatientsByHospital = async () => {
  try {
    const res = await api.get(`/hospital/patients/${userId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Fetching patients failed" };
  }
};

// 🔹 Register Diagnostic Center
export const registerDiagnostic = async ({
  hospitalId,
  diagnosticsId,
  name,
  city,
}) => {
  try {
    const res = await api.post("/hospital/diagnostic", {
      hospitalId,
      diagnosticsId,
      name,
      city,
      userId,
      userRole
    });
    return res.data;
  } catch (err) {
    throw (
      err.response?.data || { error: "Diagnostic center registration failed" }
    );
  }
};

// 🔹 Register Pharmacy
export const registerPharmacy = async ({
  hospitalId,
  pharmacyId,
  name,
  city,
}) => {
  try {
    const res = await api.post("/hospital/pharmacy", {
      hospitalId,
      pharmacyId,
      name,
      city,
      userId,
      userRole
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Pharmacy registration failed" };
  }
};
