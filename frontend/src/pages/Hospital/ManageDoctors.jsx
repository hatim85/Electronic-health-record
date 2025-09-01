import React, { useEffect, useState } from "react";
import {
  getDoctorsByHospital,
  deleteDoctor,
} from "../../services/hospitalService";
import { useAuth } from "../../context/useAuth";
import { userId, userRole } from "../../context/authUser";

const ManageDoctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  console.log("user: ", userId,"userRole: ",userRole);
  useEffect(() => {
    console.log("user: ", user);
    const fetchDoctors = async () => {
      try {
        const res = await getDoctorsByHospital();
        console.log("res: ", res);
        setDoctors(res);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };

    fetchDoctors();
  }, [user]);

  const handleDelete = async (doctorId, hospitalId) => {
    try {
      console.log("Deleting doctor with ID:", doctorId);
      console.log("User ID:", hospitalId);
      await deleteDoctor({ doctorId, hospitalId });
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
          <li
            key={doc.doctorId}
            className="flex justify-between items-center border-b py-2"
          >
            {console.log("doc: ", doc)}
            <span>
              {doc.name} - {doc.specialization}
            </span>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleDelete(doc.doctorId, doc.hospitalId)}
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
