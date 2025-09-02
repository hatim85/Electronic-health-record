import { useState } from "react";
import { getPatientPrescription } from "../../services/pharmaService";
import { Search } from "lucide-react";

export default function PrescriptionFetcher() {
  const [patientId, setPatientId] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setPatientId(e.target.value);
    setError(""); // Clear error when user types
  };

  // Basic client-side validation
  const validateInput = () => {
    if (!patientId) return "Patient ID is required";
    return null;
  };

  // Fetch prescriptions
  const fetchPrescription = async () => {
    const inputError = validateInput();
    if (inputError) {
      setError(inputError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await getPatientPrescription(patientId);
      setPrescriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.error || "Error fetching prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8">
      <div className="flex items-center mb-4">
        <Search className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Fetch Patient Prescription</h2>
      </div>

      {/* Input + Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            name="patientId"
            value={patientId}
            onChange={handleChange}
            className={`peer w-full px-4 py-3 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700 placeholder-transparent`}
            placeholder="Patient ID"
            required
          />
          <label
            className={`absolute left-4 top-3 text-gray-500 text-sm transition-all transform peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-blue-600 bg-white px-1 ${
              patientId ? "top-[-8px] text-sm text-blue-600" : ""
            }`}
          >
            Patient ID
          </label>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
        <button
          onClick={fetchPrescription}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg flex items-center"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
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
              Fetching...
            </span>
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Fetch
            </>
          )}
        </button>
      </div>

      {/* Prescriptions list */}
      <div className="grid gap-4">
        {prescriptions.map((p, i) => (
          <div
            key={i}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2"
          >
            <h3 className="font-bold text-lg text-gray-800">{p.prescription}</h3>
            <p className="text-gray-700">
              <strong>Diagnosis:</strong> {p.diagnosis}
            </p>
            <p className="text-gray-700">
              <strong>Doctor:</strong> {p.doctorId}
            </p>
            <p className="text-gray-700">
              <strong>Record ID:</strong> {p.recordId}
            </p>
            <p className="text-sm text-gray-500">
              Created: {new Date(p.createdAt).toLocaleString()}
            </p>
          </div>
        ))}

        {!loading && prescriptions.length === 0 && !error && (
          <p className="text-gray-500 text-center">No prescriptions found.</p>
        )}
        {loading && <p className="text-gray-500 text-center">⏳ Loading prescriptions...</p>}
      </div>
    </div>
  );
}