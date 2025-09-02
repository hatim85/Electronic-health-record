import { useState } from "react";
import { processResearchData } from "../../services/researcherService";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Database } from "lucide-react";

export default function ProcessData() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    datasetType: "",
    resultSummary: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setMessage("");
  };

  // Basic client-side validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.datasetType) newErrors.datasetType = "Dataset Type is required";
    if (!form.resultSummary) newErrors.resultSummary = "Result Summary is required";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await processResearchData(form);
      setMessage(`✅ Data Processed: ${data.message || "Success"}`);
      setForm({ datasetType: "", resultSummary: "" });
      setErrors({});
    } catch (err) {
      setMessage(`❌ ${err.error || "Failed to process data"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-lg p-8 sm:p-10">
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
          <Database className="w-12 h-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">Process Research Data</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Submit research data for processing
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              name="datasetType"
              value={form.datasetType}
              onChange={handleChange}
              className={`peer w-full px-4 py-3 border ${
                errors.datasetType ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700 placeholder-transparent`}
              placeholder="Dataset Type"
              required
            />
            <label
              className={`absolute left-4 top-3 text-gray-500 text-sm transition-all transform peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-blue-600 bg-white px-1 ${
                form.datasetType ? "top-[-8px] text-sm text-blue-600" : ""
              }`}
            >
              Dataset Type (e.g., Prescription, Lab Report)
            </label>
            {errors.datasetType && (
              <p className="text-red-500 text-xs mt-1">{errors.datasetType}</p>
            )}
          </div>

          <div className="relative">
            <textarea
              name="resultSummary"
              value={form.resultSummary}
              onChange={handleChange}
              className={`peer w-full px-4 py-3 border ${
                errors.resultSummary ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700 placeholder-transparent`}
              placeholder="Result Summary"
              rows="4"
              required
            />
            <label
              className={`absolute left-4 top-3 text-gray-500 text-sm transition-all transform peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-blue-600 bg-white px-1 ${
                form.resultSummary ? "top-[-8px] text-sm text-blue-600" : ""
              }`}
            >
              Result Summary
            </label>
            {errors.resultSummary && (
              <p className="text-red-500 text-xs mt-1">{errors.resultSummary}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
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
                Processing...
              </span>
            ) : (
              "Process Data"
            )}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}