import { useState } from "react";
import { updatePatientRecord } from "../../services/doctorService";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";

export default function UpdateRecord() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    recordId: "",
    patientId: "",
    diagnosis: "",
    prescription: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setMessage(null);
  };

  // Basic client-side validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.recordId) newErrors.recordId = "Record ID is required";
    if (!formData.patientId) newErrors.patientId = "Patient ID is required";
    if (!formData.diagnosis) newErrors.diagnosis = "Diagnosis is required";
    if (!formData.prescription) newErrors.prescription = "Prescription is required";
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
      await updatePatientRecord(formData);
      setMessage("✅ Patient record updated successfully!");
      setFormData({ recordId: "", patientId: "", diagnosis: "", prescription: "" });
      setErrors({});
    } catch (err) {
      setMessage(`❌ ${err.error || "Failed to update patient record"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-lg p-8 sm:p-10">
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
          <Edit className="w-12 h-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">Update Patient Record</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Update an existing patient record
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {[
            { label: "Record ID", name: "recordId" },
            { label: "Patient ID", name: "patientId" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className={`peer w-full px-4 py-3 border ${
                  errors[field.name] ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700 placeholder-transparent`}
                placeholder={field.label}
                required
              />
              <label
                className={`absolute left-4 top-3 text-gray-500 text-sm transition-all transform peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-blue-600 bg-white px-1 ${
                  formData[field.name] ? "top-[-8px] text-sm text-blue-600" : ""
                }`}
              >
                {field.label}
              </label>
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {[
            { label: "Updated Diagnosis", name: "diagnosis" },
            { label: "Updated Prescription", name: "prescription" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className={`peer w-full px-4 py-3 border ${
                  errors[field.name] ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700 placeholder-transparent`}
                placeholder={field.label}
                rows="4"
                required
              />
              <label
                className={`absolute left-4 top-3 text-gray-500 text-sm transition-all transform peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-blue-600 bg-white px-1 ${
                  formData[field.name] ? "top-[-8px] text-sm text-blue-600" : ""
                }`}
              >
                {field.label}
              </label>
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

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
                Updating...
              </span>
            ) : (
              "Update Record"
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