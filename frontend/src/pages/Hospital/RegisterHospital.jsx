import React, { useState } from "react";
import { registerHospital } from "../../services/hospitalService";
import { useAuth } from "../../context/useAuth";

const RegisterHospital = () => {
  const [form, setForm] = useState({
    hospitalId: "",
    name: "",
    city: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerHospital(form);
      alert("🏥 Hospital registered successfully!");
      setForm({ hospitalId: "", name: "", city: "" });
    } catch (err) {
      alert(err.error || "Hospital registration failed!");
    }
  };

  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">🏥 Register Hospital</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            name="hospitalId"
            value={form.hospitalId}
            onChange={handleChange}
            placeholder="Hospital ID"
            className="border p-2 w-full rounded-lg"
            required
          />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Hospital Name"
            className="border p-2 w-full rounded-lg"
            required
          />
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="border p-2 w-full rounded-lg"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
          >
            Register Hospital
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterHospital;
