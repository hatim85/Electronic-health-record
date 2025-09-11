import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogIn } from "lucide-react";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setUserId(e.target.value);
    setError(null); // Clear error when user types
  };

  // Basic client-side validation
  const validateForm = () => {
    if (!userId) return "User ID is required";
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formError = validateForm();

    if (formError) {
      setError(formError);
      return;
    }

    setLoading(true);
    try {
      const user = await login({ userId });
      console.log("user: ", user);

      if (!user.success) {
        setError(user.message);
        return;
      }

      // Role-based routing
      const roleRoutes = {
        superAdmin: "/hospital/dashboard",
        hospital: "/hospital/dashboard",
        patient: "/patient/dashboard",
        diagnostics: "/diagnostics/dashboard",
        doctor: "/doctor/dashboard",
        pharmacy: "/pharma/dashboard",
        researcher: "/researcher/dashboard",
        researchAdmin: "/researcher/dashboard",
        insuranceAdmin: "/insurance/dashboard",
        insuranceCompany: "/insurance/dashboard",
        insuranceAgent: "/insurance/dashboard",
      };

      const redirectPath = roleRoutes[user.user.userRole] || "/";
      navigate(redirectPath);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-lg p-8 sm:p-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-blue-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <LogIn className="w-12 h-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Sign in with your User ID to access your dashboard
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              name="userId"
              value={userId}
              onChange={handleChange}
              className={`peer w-full px-4 py-3 border ${error ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700 placeholder-transparent`}
              placeholder="User ID"
              required
            />
            <label
              className={`absolute left-4 top-3 text-gray-500 text-sm transition-all transform peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-blue-600 bg-white px-1 ${userId ? "top-[-8px] text-sm text-blue-600" : ""
                }`}
            >
              User ID
            </label>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}