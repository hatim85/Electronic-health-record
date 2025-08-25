import { Link } from "react-router-dom";

export default function DiagnosticsDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Diagnostics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/diagnostics/upload"
          className="bg-blue-500 text-white p-6 rounded-2xl shadow hover:bg-blue-600"
        >
          Upload Lab Report
        </Link>
        <Link
          to="/diagnostics/reports"
          className="bg-green-500 text-white p-6 rounded-2xl shadow hover:bg-green-600"
        >
          View Lab Reports
        </Link>
        <Link
          to="/diagnostics/request"
          className="bg-purple-500 text-white p-6 rounded-2xl shadow hover:bg-purple-600"
        >
          Request New Test
        </Link>
      </div>
    </div>
  );
}
