import { useEffect, useState } from "react";
import { getPatientsByDoctor } from "../../services/doctorService";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";

export default function MyPatients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleFetch = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getPatientsByDoctor();
        console.log("Fetched patients:", res);
        setPatients(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Failed to fetch patients", err);
        setError(`❌ ${err.error || "Failed to fetch patients"}`);
      } finally {
        setLoading(false);
      }
    };
    handleFetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-8 sm:p-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/doctor/dashboard")}
          className="flex items-center text-gray-600 hover:text-blue-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <Users className="w-12 h-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">My Patients</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            View all patients and their records
          </p>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        {/* Patients list */}
        {loading ? (
          <p className="text-gray-500 text-center flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-gray-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading patients...
          </p>
        ) : patients.length === 0 ? (
          <p className="text-gray-500 text-center">No patients found.</p>
        ) : (
          <div className="grid gap-4">
            {patients.map((p, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2"
              >
                <p className="text-gray-700">
                  <strong>Patient ID:</strong> {p.patientId}
                </p>
                <p className="text-gray-700">
                  <strong>Name:</strong> {p.name}
                </p>
                <p className="text-gray-700">
                  <strong>DOB:</strong> {p.dob ? new Date(p.dob).toLocaleDateString() : "N/A"}
                </p>
                {p.records && p.records.length > 0 ? (
                  <div className="mt-2">
                    <h4 className="font-semibold text-gray-800">Records:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      {p.records.map((r, rIdx) => (
                        <li key={rIdx} className="mt-1">
                          <p className="text-gray-700">
                            <strong>Record ID:</strong> {r.recordId}
                          </p>
                          <p className="text-gray-700">
                            <strong>Diagnosis:</strong> {r.diagnosis}
                          </p>
                          <p className="text-gray-700">
                            <strong>Prescription:</strong> {r.prescription}
                          </p>
                          <p className="text-sm text-gray-500">
                            Created: {r.createdAt ? new Date(r.createdAt).toLocaleString() : "N/A"}
                          </p>
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
    </div>
  );
}