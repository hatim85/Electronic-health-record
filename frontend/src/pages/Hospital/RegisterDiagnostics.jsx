import React, { useState } from "react";
import { registerDiagnostic } from "../../services/hospitalService";
import { getUserId, getUserRole } from "../../context/authUser";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Microscope } from "lucide-react";

const RegisterDiagnostics = () => {
  const userId = getUserId();
  const userRole = getUserRole();
  console.log("userId: ", userId);
  console.log("userRole: ", userRole);

  const navigate = useNavigate();
  const [form, setForm] = useState({
    hospitalId: "",
    diagnosticsId: "",
    name: "",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" }); // ✅ message state

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    setErrors({ ...errors, [name]: "" });
    setMessage({ type: "", text: "" }); // clear old message when editing
  };

  // Basic client-side validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.hospitalId) newErrors.hospitalId = "Hospital ID is required";
    if (!form.diagnosticsId) newErrors.diagnosticsId = "Diagnostics ID is required";
    if (!form.name) newErrors.name = "Diagnostics Name is required";
    if (!form.city) newErrors.city = "City is required";
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
    setMessage({ type: "", text: "" });

    try {
      await registerDiagnostic({ ...form });
      setMessage({
        type: "success",
        text: "🧪 Diagnostic Center registered successfully!",
      });
      setForm({
        hospitalId: "",
        diagnosticsId: "",
        name: "",
        city: "",
      });

      // Give user time to see the message before navigating
      setTimeout(() => navigate("/hospital/dashboard"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.error || "Diagnostic Center registration failed!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-lg p-8 sm:p-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/hospital/dashboard")}
          className="flex items-center text-gray-600 hover:text-blue-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Title */}
        <div className="flex flex-col items-center mb-6">
          <Microscope className="w-12 h-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">
            Register Diagnostic Center
          </h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Add a new diagnostic center by filling out the details below
          </p>
        </div>

        {/* Success / Error Message */}
        {message.text && (
          <div
            className={`mb-6 p-3 rounded-lg text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {[
            { label: "Hospital ID", name: "hospitalId" },
            { label: "Diagnostics ID", name: "diagnosticsId" },
            { label: "Diagnostics Name", name: "name" },
            { label: "City", name: "city" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <input
                type="text"
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className={`peer w-full px-4 py-3 border ${
                  errors[field.name] ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700 placeholder-transparent`}
                placeholder={field.label}
                required
              />
              <label
                className={`absolute left-4 top-3 text-gray-500 text-sm transition-all transform peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-blue-600 bg-white px-1 ${
                  form[field.name] ? "top-[-8px] text-sm text-blue-600" : ""
                }`}
              >
                {field.label}
              </label>
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field.name]}
                </p>
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
                Registering...
              </span>
            ) : (
              "Register Diagnostic Center"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterDiagnostics;
