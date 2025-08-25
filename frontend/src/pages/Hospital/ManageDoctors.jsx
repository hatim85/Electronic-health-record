import React, { useEffect, useState } from "react";
import { getDoctorsByHospital, deleteDoctor } from "../../services/hospitalService";
import { useAuth } from "../../context/AuthContext";

const ManageDoctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctorsByHospital(user?.id);
        setDoctors(res);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };

    if (user?.id) fetchDoctors();
  }, [user]);

  const handleDelete = async (doctorId) => {
    try {
      await deleteDoctor({ doctorId, hospitalId: user.id });
      setDoctors((prev) => prev.filter((d) => d.doctorId !== doctorId));
    } catch (err) {
      console.error("Failed to delete doctor:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">⚕️ Manage Doctors</h1>
      <ul className="mt-4">
        {doctors.map((doc) => (
          <li key={doc.doctorId} className="flex justify-between items-center border-b py-2">
            <span>{doc.name} - {doc.specialization}</span>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleDelete(doc.doctorId)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageDoctors;
