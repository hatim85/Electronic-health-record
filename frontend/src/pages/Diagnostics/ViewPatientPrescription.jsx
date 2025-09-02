import { useState } from "react";
import { getPatientPrescription } from "../../services/diagnosticsService";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";

export default function ViewPatientPrescription() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientId: "",
  });
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage(null); // Clear message when user types
  };

  // Basic client-side validation
  const validateForm = () => {
    if (!formData.patientId) return "Patient ID is required";
    return null;
  };

  // Fetch prescriptions
  const handleFetch = async (e) => {
    e.preventDefault();
    const formError = validateForm();

    if (formError) {
      setMessage(`❌ ${formError}`);
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await getPatientPrescription(formData.patientId);
      console.log("API Response:", res);
      setPrescriptions(Array.isArray(res) ? res : [res]);
      if (!res || res.length === 0) setMessage("No prescriptions found.");
    } catch (err) {
      console.error("Error fetching prescription", err);
      setMessage(`❌ ${err.error || "Failed to fetch prescription"}`);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-lg p-8 sm:p-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/diagnostics/dashboard")}
          className="flex items-center text-gray-600 hover:text-blue-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <Search className="w-12 h-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">View Patient Prescriptions</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Fetch prescriptions for a patient by ID
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleFetch}>
          <div className="relative">
            <input
              type="text"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className={`peer w-full px-4 py-3 border ${
                message?.includes("❌") ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700 placeholder-transparent`}
              placeholder="Patient ID"
              required
            />
            <label
              className={`absolute left-4 top-3 text-gray-500 text-sm transition-all transform peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-blue-600 bg-white px-1 ${
                formData.patientId ? "top-[-8px] text-sm text-blue-600" : ""
              }`}
            >
              Patient ID
            </label>
            {message?.includes("❌") && (
              <p className="text-red-500 text-xs mt-1">{message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg flex items-center justify-center"
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
                Fetch Prescriptions
              </>
            )}
          </button>
        </form>

        {/* Message */}
        {message && !message.includes("❌") && (
          <p className="mt-4 text-center text-gray-500">{message}</p>
        )}

        {/* Prescriptions list */}
        {prescriptions.length > 0 && (
          <div className="mt-6 space-y-4">
            {prescriptions.map((report, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2"
              >
                <p className="text-gray-700">
                  <strong>Patient:</strong> {report.patientId}
                </p>
                <p className="text-gray-700">
                  <strong>Doctor:</strong> {report.doctorId}
                </p>
                <p className="text-gray-700">
                  <strong>Diagnosis:</strong> {report.diagnosis}
                </p>
                <p className="text-gray-700">
                  <strong>Prescription:</strong> {report.prescription}
                </p>
                <p className="text-gray-700">
                  <strong>Record ID:</strong> {report.recordId}
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}