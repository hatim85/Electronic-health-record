import { useState } from "react";
import { updateMedicineStock } from "../../services/pharmaService";

export default function UpdateStock() {
  const [form, setForm] = useState({
    pharmacyId: "",
    medicineName: "",
    newStock: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting form:", form);
      const data = await updateMedicineStock(form);
      setMessage(`✅ Stock Updated: ${data.message || "Success"}`);
    } catch (err) {
      setMessage(`❌ ${err.error}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Update Medicine Stock</h1>
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
        <input
          name="pharmacyId"
          placeholder="Pharmacy ID"
          value={form.pharmacyId}
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
          name="newStock"
          placeholder="New Stock"
          type="number"
          value={form.newStock}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
