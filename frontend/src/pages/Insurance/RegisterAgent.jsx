import React, { useState } from "react";
import { registerInsuranceAgent } from "../../services/insuranceService";

const RegisterAgent = () => {
  const [form, setForm] = useState({ agentId: "", insuranceCompany: "", name: "", city: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerInsuranceAgent(form);
      setMessage(`✅ Agent registered: ${res.message || "Success"}`);
    } catch (err) {
      setMessage(`❌ ${err.error}`);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register Insurance Agent</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="agentId" placeholder="Agent ID" value={form.agentId} onChange={handleChange} className="w-full border p-2" />
        <input name="insuranceCompany" placeholder="Insurance Company" value={form.insuranceCompany} onChange={handleChange} className="w-full border p-2" />
        <input name="name" placeholder="Agent Name" value={form.name} onChange={handleChange} className="w-full border p-2" />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="w-full border p-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default RegisterAgent;
