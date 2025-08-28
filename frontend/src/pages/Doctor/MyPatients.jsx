import { useEffect, useState } from "react";
import { getPatientsByDoctor } from "../../services/doctorService";

export default function MyPatients() {
  const [doctorId, setDoctorId] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const res = await getPatientsByDoctor(doctorId);
      console.log("Fetched patients:", res);
      setPatients(res);
    } catch (err) {
      console.error("Failed to fetch patients", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Patients</h2>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Enter Doctor ID"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
        <button
          onClick={handleFetch}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Fetch Patients
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div className="space-y-4">
          {patients.map((p, idx) => (
            <div
              key={idx}
              className="border p-4 rounded-lg shadow bg-white"
            >
              <p><strong>Patient ID:</strong> {p.patientId}</p>
              <p><strong>Name:</strong> {p.name}</p>
              <p><strong>DOB:</strong> {p.dob}</p>

              {p.records && p.records.length > 0 ? (
                <div className="mt-2">
                  <h4 className="font-semibold">Records:</h4>
                  <ul className="list-disc pl-6">
                    {p.records.map((r, rIdx) => (
                      <li key={rIdx} className="mt-1">
                        <p><strong>Record ID:</strong> {r.recordId}</p>
                        <p><strong>Diagnosis:</strong> {r.diagnosis}</p>
                        <p><strong>Prescription:</strong> {r.prescription}</p>
                        <p><strong>Date:</strong> {r.createdAt}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-2 text-gray-500">No records available</p>
              )}
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
