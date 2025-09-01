import { useState } from "react";
import { dispenseMedicine } from "../../services/pharmaService";

export default function DispenseMedicine() {
  const [form, setForm] = useState({
    patientId: "",
    recordId: "",
    medicineName: "",
    quantity: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await dispenseMedicine(form);
      setMessage(`✅ Medicine Dispensed: ${data.message || "Success"}`);
    } catch (err) {
      setMessage(`❌ ${err.error}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dispense Medicine</h1>
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
        <input
          name="patientId"
          placeholder="Patient ID"
          value={form.patientId}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="recordId"
          placeholder="Record ID"
          value={form.recordId}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="medicineName"
          placeholder="Medicine Name"
          value={form.medicineName}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="quantity"
          placeholder="Quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Dispense
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
