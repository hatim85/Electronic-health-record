import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("patient"); // default role
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ userId, userRole });
      navigate("/hospital/dashboard"); // redirect after login
    } catch (err) {
      setError(err.error || "Failed to login");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />

          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select Role</option>
            <option value="hospitalAdmin">HospitalAdmin</option>
            <option value="insuranceAdmin">InsuranceAdmin</option>
            <option value="researchAdmin">ResearchAdmin</option>
            <option value="hospital">Hospital</option>
            <option value="diagnostics">Diagnostics</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="insuranceAgent">Insurance Agent</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="researcher">Researcher</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
