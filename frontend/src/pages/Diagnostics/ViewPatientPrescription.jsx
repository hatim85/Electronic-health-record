import { useState } from "react";
import { getPatientPrescription } from "../../services/diagnosticsService";

export default function ViewPatientPrescription() {
  const [formData, setFormData] = useState({
    patientId: ""
  });
  const [reports, setReports] = useState([]); // <-- change to array
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!formData.patientId) return;

    setLoading(true);
    setMessage(null);
    try {
      const res = await getPatientPrescription(formData.patientId);
      console.log("API Response:", res);
      setReports(Array.isArray(res) ? res : [res]); // normalize to array
      if (!res || res.length === 0) setMessage("No prescription found.");
    } catch (err) {
      console.error("Error fetching prescription", err);
      setMessage("Failed to fetch prescription.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">View Patient Prescription</h2>

      {message && <p className="mb-3 text-blue-600">{message}</p>}

      <form onSubmit={handleFetch} className="space-y-4">
        <input
          type="text"
          name="patientId"
          placeholder="Patient ID"
          value={formData.patientId}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Prescription"}
        </button>
      </form>

      {reports.length > 0 && (
        <div className="mt-6 space-y-4">
          {reports.map((report, idx) => (
            <div key={idx} className="border rounded-lg p-4 shadow bg-gray-50">
              <p><strong>Patient:</strong> {report.patientId}</p>
              <p><strong>Doctor:</strong> {report.doctorId}</p>
              <p><strong>Diagnosis:</strong> {report.diagnosis}</p>
              <p><strong>Prescription:</strong> {report.prescription}</p>
              <p><strong>Record ID:</strong> {report.recordId}</p>
              <p className="text-sm text-gray-500">
                Created: {new Date(report.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
