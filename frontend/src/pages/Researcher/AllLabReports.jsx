import { useState } from "react";
import { getAllLabReports } from "../../services/researcherService";
import { Card, CardContent } from "../../components/Card";

export default function AllLabReports() {
  const [researcherId] = useState("researcher123");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllLabReports(researcherId);
      setReports(data.reports || []);
    } catch (err) {
      setError(err.error || "Error fetching lab reports");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Lab Reports</h1>
      <button
        onClick={fetchReports}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Load Lab Reports
      </button>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="grid gap-4 mt-4">
        {reports.map((r, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <h2 className="font-semibold">Report ID: {r.reportId}</h2>
              <p>Patient ID: {r.patientId}</p>
              <p>Type: {r.testType}</p>
              <p>Result: {r.result}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
