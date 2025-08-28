import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { approveClaim } from "../../services/insuranceService";

const ApproveClaim = () => {
  const { claimId } = useParams();
  const [form, setForm] = useState({ insuranceId: "", claimId: "", patientId: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await approveClaim({ ...form });
      setMessage(`✅ Claim approved: ${res.message || "Success"}`);
    } catch (err) {
      setMessage(`❌ ${err.error}`);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Approve Claim</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="insuranceId" placeholder="Insurance ID" value={form.insuranceId} onChange={handleChange} className="w-full border p-2" />
         <input name="claimId" placeholder="Claim ID" value={form.claimId} onChange={handleChange} className="w-full border p-2" />
        <input name="patientId" placeholder="Patient ID" value={form.patientId} onChange={handleChange} className="w-full border p-2" />
        <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">Approve</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default ApproveClaim;
