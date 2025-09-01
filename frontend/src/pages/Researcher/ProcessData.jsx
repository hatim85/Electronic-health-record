import { useState } from "react";
import { processResearchData } from "../../services/researcherService";

export default function ProcessData() {
  const [form, setForm] = useState({
    datasetType: "",
    resultSummary: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await processResearchData(form);
      setMessage(`✅ Data Processed: ${data.message || "Success"}`);
    } catch (err) {
      setMessage(`❌ ${err.error}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Process Research Data</h1>
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
        <input
          name="datasetType"
          placeholder="Dataset Type (e.g., Prescription, Lab Report)"
          value={form.datasetType}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <textarea
          name="resultSummary"
          placeholder="Result Summary"
          value={form.resultSummary}
          onChange={handleChange}
          className="border p-2 rounded h-32"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
