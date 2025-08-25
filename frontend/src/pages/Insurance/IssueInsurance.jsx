import React, { useState } from "react";
import { issueInsurance } from "../../services/insuranceService";

const IssueInsurance = () => {
  const [form, setForm] = useState({
    insuranceId: "",
    patientId: "",
    policyNumber: "",
    coverageAmount: "",
    insuranceCompany: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await issueInsurance(form);
      setMessage(`✅ Insurance issued: ${res.message || "Success"}`);
    } catch (err) {
      setMessage(`❌ ${err.error}`);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Issue Insurance Policy</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="insuranceId" placeholder="Insurance ID" value={form.insuranceId} onChange={handleChange} className="w-full border p-2" />
        <input name="patientId" placeholder="Patient ID" value={form.patientId} onChange={handleChange} className="w-full border p-2" />
        <input name="policyNumber" placeholder="Policy Number" value={form.policyNumber} onChange={handleChange} className="w-full border p-2" />
        <input name="coverageAmount" placeholder="Coverage Amount" value={form.coverageAmount} onChange={handleChange} className="w-full border p-2" />
        <input name="insuranceCompany" placeholder="Insurance Company" value={form.insuranceCompany} onChange={handleChange} className="w-full border p-2" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Issue</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default IssueInsurance;
