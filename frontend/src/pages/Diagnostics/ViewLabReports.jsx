import { useEffect, useState } from "react";
import { getAllLabReports } from "../../services/researcherService";

export default function ViewLabReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getAllLabReports();
        setReports(res);
      } catch (err) {
        console.error("Error fetching reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <p className="p-6">Loading lab reports...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lab Reports</h2>
      {reports.length === 0 ? (
        <p>No lab reports found.</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 shadow bg-white"
            >
              <p><strong>Patient:</strong> {report.patientId}</p>
              <p><strong>Test Type:</strong> {report.testType}</p>
              <p><strong>Result:</strong> {report.result}</p>
              <p className="text-sm text-gray-500">
                Uploaded At: {report.timestamp}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
