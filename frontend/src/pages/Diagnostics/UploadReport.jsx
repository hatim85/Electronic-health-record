import { useState } from "react";
import { uploadLabReport } from "../../services/diagnosticsService";

export default function UploadLabReport() {
  const [formData, setFormData] = useState({
    labId: "",
    patientId: "",
    reportType: "",
    reportData: "",
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const res=await uploadLabReport(formData);
      console.log(res);
      setMessage("Lab report uploaded successfully!");
    } catch (err) {
      setMessage("Failed to upload lab report");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Upload Lab Report</h2>

      {message && <p className="mb-3 text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
          <input
          type="text"
          name="labId"
          placeholder="Lab ID"
          value={formData.labId}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="patientId"
          placeholder="Patient ID"
          value={formData.patientId}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />

        <input
          type="text"
          name="reportType"
          placeholder="Test Type (e.g. Blood Test)"
          value={formData.reportType}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />

        <textarea
          name="reportData"
          placeholder="Test reportDatas"
          value={formData.reportData}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
