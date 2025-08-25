import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  registerResearcher,
} from "../../services/researcherService";
import {
  registerPatient,
} from "../../services/hospitalService";
import {
  registerInsuranceAgent,
} from "../../services/insuranceService";

export default function Register() {
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (role === "patient") {
        await registerPatient(formData);
      } else if (role === "researcher") {
        await registerResearcher(formData);
      } else if (role === "insuranceAgent") {
        await registerInsuranceAgent(formData);
      }
      // TODO: Add doctor + pharmacy registration if backend is ready

      navigate("/login");
    } catch (err) {
      setError(err.error || "Failed to register");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="patient">Patient</option>
            <option value="researcher">Researcher</option>
            <option value="insuranceAgent">Insurance Agent</option>
            <option value="doctor">Doctor</option>
            <option value="pharmacy">Pharmacy</option>
          </select>

          <input
            type="text"
            name="userId"
            placeholder="User ID"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />

          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />

          {role === "patient" && (
            <input
              type="text"
              name="age"
              placeholder="Age"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          )}

          {role === "researcher" && (
            <input
              type="text"
              name="institution"
              placeholder="Institution"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          )}

          {role === "insuranceAgent" && (
            <input
              type="text"
              name="insuranceCompany"
              placeholder="Insurance Company"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
