import React, { useEffect, useState } from "react";
import {
  getDoctorsByHospital,
  getPatientsByHospital,
} from "../../services/hospitalService";

const HospitalDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorRes = await getDoctorsByHospital();
        setDoctors(doctorRes);

        const patientRes = await getPatientsByHospital();
        setPatients(patientRes);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };

  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🏥 Hospital Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-2">👨‍⚕️ Doctors</h2>
          <ul>
            {doctors.map((doc) => (
              <li key={doc.doctorId}>
                {doc.name} ({doc.specialization})
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-2">🧑‍🤝‍🧑 Patients</h2>
          <ul>
            {patients.map((pat) => (
              <li key={pat.patientId}>
                {pat.name} ({pat.gender})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
