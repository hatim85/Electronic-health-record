import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyHistory } from "../../services/patientService";
import { ArrowLeft, ClipboardList } from "lucide-react";

export default function MyHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getMyHistory();
        console.log("API Response:", res);
        setHistory(Array.isArray(res) ? res : []);
      } catch (err) {
        setError(`❌ ${err.error || "Failed to load history"}`);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-8 sm:p-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/patient/dashboard")}
          className="flex items-center text-gray-600 hover:text-blue-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <ClipboardList className="w-12 h-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">My Treatment History</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            View your treatment history
          </p>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        {/* History list */}
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
            Loading history...
          </p>
        ) : history.length === 0 ? (
          <p className="text-gray-500 text-center">No treatment history found.</p>
        ) : (
          <div className="grid gap-4">
            {history.map((h, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2"
              >
                {/* Record Info */}
                {h.recordId && (
                  <p className="text-gray-700">
                    <strong>Record ID:</strong> {h.recordId}
                  </p>
                )}
                {h.createdAt && (
                  <p className="text-sm text-gray-500">
                    <strong>Date:</strong>{" "}
                    {new Date(h.createdAt).toLocaleString()}
                  </p>
                )}
                {h.updatedAt && (
                  <p className="text-sm text-gray-500">
                    <strong>Last Updated:</strong>{" "}
                    {new Date(h.updatedAt).toLocaleString()}
                  </p>
                )}
                {h.doctorId && (
                  <p className="text-gray-700">
                    <strong>Provider:</strong> {h.doctorId}
                  </p>
                )}

                {/* Treatment Details */}
                {h.diagnosis && (
                  <p className="text-gray-700">
                    <strong>Diagnosis:</strong> {h.diagnosis}
                  </p>
                )}
                {h.treatment && (
                  <p className="text-gray-700">
                    <strong>Treatment:</strong> {h.treatment}
                  </p>
                )}
                {h.prescription && (
                  <p className="text-gray-700">
                    <strong>Prescription:</strong> {h.prescription}
                  </p>
                )}
                {h.dispensedMedicines && h.dispensedMedicines.length > 0 && (
                  <div className="text-gray-700">
                    <strong>Dispensed Medicines:</strong>
                    {h.dispensedMedicines.map((med, medIndex) => (
                      <div key={medIndex} className="ml-4 mt-1">
                        <p>
                          <strong>Name:</strong> {med.medicineName || "N/A"}
                        </p>
                        <p>
                          <strong>Quantity:</strong> {med.quantity || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Dispensed At:</strong>{" "}
                          {med.dispensedAt
                            ? new Date(med.dispensedAt).toLocaleString()
                            : "N/A"}
                        </p>
                        <p>
                          <strong>Pharmacy ID:</strong> {med.pharmacyId || "N/A"}
                        </p>
                        <p>
                          <strong>Patient ID:</strong> {med.patientId || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Lab Report Details */}
                {h.labReport && (
                  <div className="text-gray-700">
                    <strong>Lab Report:</strong>
                    <div className="ml-4 mt-1">
                      {h.labReport.reportType && (
                        <p>
                          <strong>Type:</strong> {h.labReport.reportType}
                        </p>
                      )}
                      {h.labReport.reportData && (
                        <p>
                          <strong>Data:</strong> {h.labReport.reportData}
                        </p>
                      )}
                      {h.labReport.createdAt && (
                        <p className="text-sm text-gray-500">
                          <strong>Date:</strong>{" "}
                          {new Date(h.labReport.createdAt).toLocaleString()}
                        </p>
                      )}
                      {h.labReport.labId && (
                        <p>
                          <strong>Lab ID:</strong> {h.labReport.labId}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}