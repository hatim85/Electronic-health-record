import { useState } from "react";
import { getAllLabReports } from "../../services/diagnosticsService";

export default function ViewLabReports() {
  const [labId, setLabId] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!labId) return;

    setLoading(true);
    setMessage(null);
    try {
      const res = await getAllLabReports(labId);
      setReports(res);
      if (!res || res.length === 0) setMessage("No reports found for this lab.");
    } catch (err) {
      console.error("Error fetching lab reports", err);
      setMessage("Failed to fetch lab reports.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">View Lab Reports</h2>

      {message && <p className="mb-3 text-blue-600">{message}</p>}

      <form onSubmit={handleFetch} className="space-y-4">
        <input
          type="text"
          name="labId"
          placeholder="Lab ID"
          value={labId}
          onChange={(e) => setLabId(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Reports"}
        </button>
      </form>

      {reports.length > 0 && (
        <div className="mt-6 space-y-4">
          {reports.map((report, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 shadow bg-gray-50"
            >
              <p><strong>Patient:</strong> {report.patientId}</p>
              <p><strong>Lab:</strong> {report.labReport.labId}</p>
              <p><strong>Type:</strong> {report.labReport.reportType}</p>
              <p><strong>Data:</strong> {report.labReport.reportData}</p>
              <p className="text-sm text-gray-500">
                Timestamp: {report.labReport.createdAt}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
