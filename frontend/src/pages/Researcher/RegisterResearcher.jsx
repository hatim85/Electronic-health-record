import React, { useState } from "react";
import { registerResearcher } from "../../services/researcherService";

const RegisterResearcher = () => {
  const [formData, setFormData] = useState({
    researcherId: "",
    name: "",
    institution: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await registerResearcher(formData);
      setMessage(res.message || "Researcher registered successfully!");
    } catch (err) {
      setError(err.error || "Failed to register researcher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Register Researcher
      </h2>

      {message && <p className="text-green-600 text-center mb-4">{message}</p>}
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Researcher ID</label>
          <input
            type="text"
            name="researcherId"
            value={formData.researcherId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block font-semibold">Institution</label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Registering..." : "Register Researcher"}
        </button>
      </form>
    </div>
  );
};

export default RegisterResearcher;
