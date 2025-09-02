import { useState, useEffect } from "react";
import { getAllPrescriptions } from "../../services/researcherService";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

export default function AllPrescriptions() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch prescriptions on mount
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAllPrescriptions();
        console.log("Fetched prescriptions data:", data);
        setPrescriptions(Array.isArray(data) ? data : data.prescriptions || []);
      } catch (err) {
        setError(`❌ ${err.error || "Error fetching prescriptions"}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-8 sm:p-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/researcher/dashboard")}
          className="flex items-center text-gray-600 hover:text-blue-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <FileText className="w-12 h-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">All Prescriptions</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            View all prescriptions in the system
          </p>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        {/* Prescriptions list */}
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
            Loading prescriptions...
          </p>
        ) : prescriptions.length > 0 ? (
          <div className="grid gap-4">
            {prescriptions.map((p, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2"
              >
                <h2 className="font-bold text-lg text-gray-800">{p.prescription}</h2>
                <p className="text-gray-700">
                  <strong>Diagnosis:</strong> {p.diagnosis}
                </p>
                <p className="text-gray-700">
                  <strong>Doctor ID:</strong> {p.doctorId}
                </p>
                <p className="text-gray-700">
                  <strong>Patient ID:</strong> {p.patientId}
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(p.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No prescriptions found.</p>
        )}
      </div>
    </div>
  );
}