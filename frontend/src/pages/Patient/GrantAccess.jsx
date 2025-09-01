import { useState } from "react";
import { grantAccess } from "../../services/patientService";

export default function GrantAccess() {
  const [form, setForm] = useState({ entityId: "", entityRole: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await grantAccess(form);
      setMessage(`Access granted: ${JSON.stringify(res)}`);
    } catch (err) {
      setMessage(err.error || "Failed to grant access");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Grant Access</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input placeholder="Entity ID" className="border p-2" value={form.entityId} onChange={(e) => setForm({ ...form, entityId: e.target.value })} />
        <input placeholder="Entity Role (doctor/hospital/insurance)" className="border p-2" value={form.entityRole} onChange={(e) => setForm({ ...form, entityRole: e.target.value })} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Grant</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
