import { useState } from "react";
import { requestClaim } from "../../services/patientService";

export default function RequestClaim() {
  const [form, setForm] = useState({ patientId: "", policyNumber: "", amount: "", reason: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await requestClaim(form);
      setMessage(`Claim requested: ${JSON.stringify(res)}`);
    } catch (err) {
      setMessage(err.error || "Failed to request claim");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Request Claim</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input placeholder="Patient ID" className="border p-2" value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} />
        <input placeholder="Policy Number" className="border p-2" value={form.policyNumber} onChange={(e) => setForm({ ...form, policyNumber: e.target.value })} />
        <input placeholder="Amount" className="border p-2" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <input placeholder="Reason" className="border p-2" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Request</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
