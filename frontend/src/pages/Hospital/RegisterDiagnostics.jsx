import React, { useState } from "react";
import { registerDiagnostic } from "../../services/hospitalService";
import { useAuth } from "../../context/useAuth";

const RegisterDiagnostics = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    hospitalId: "",
    diagnosticsId: "",
    name: "",
    city: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerDiagnostic({ ...form });
      alert("Diagnostic Center registered successfully!");
      setForm({ diagnosticsId: "", name: "", city: "" });
    } catch (err) {
      alert("Diagnostic center registration failed!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🧪 Register Diagnostic Center</h1>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <input
          name="hospitalId"
          value={form.hospitalId}
          onChange={handleChange}
          placeholder="Hospital ID"
          className="border p-2 w-full"
        />
        <input
          name="diagnosticsId"
          value={form.diagnosticsId}
          onChange={handleChange}
          placeholder="Diagnostics ID"
          className="border p-2 w-full"
        />
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 w-full"
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterDiagnostics;
