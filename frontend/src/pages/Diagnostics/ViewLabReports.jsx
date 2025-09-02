import { useState, useEffect } from "react";
import { getAllLabReports } from "../../services/diagnosticsService";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

export default function ViewLabReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch reports on mount
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const res = await getAllLabReports();
        setReports(Array.isArray(res) ? res : []);
        if (!res || res.length === 0) setMessage("No reports found for this lab.");
      } catch (err) {
        console.error("Error fetching lab reports", err);
        setMessage(`❌ ${err.error || "Failed to fetch lab reports"}`);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-8 sm:p-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/diagnostics/dashboard")}
          className="flex items-center text-gray-600 hover:text-blue-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <FileText className="w-12 h-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">View Lab Reports</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Review all lab reports for this diagnostics center
          </p>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`mb-6 text-center ${
              message.includes("✅") ? "text-green-600" : "text-gray-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Reports list */}
        {loading ? (
          <p className="text-gray-500 text-center flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-gray-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading reports...
          </p>
        ) : reports.length > 0 ? (
          <div className="grid gap-4">
            {reports.map((report, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2"
              >
                <p className="text-gray-700">
                  <strong>Patient:</strong> {report.patientId}
                </p>
                <p className="text-gray-700">
                  <strong>Lab:</strong> {report.labReport.labId}
                </p>
                <p className="text-gray-700">
                  <strong>Type:</strong> {report.labReport.reportType}
                </p>
                <p className="text-gray-700">
                  <strong>Data:</strong> {report.labReport.reportData}
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(report.labReport.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}