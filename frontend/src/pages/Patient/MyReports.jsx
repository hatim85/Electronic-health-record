import { useState } from "react";
import { getMyReports } from "../../services/patientService";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      const res = await getMyReports();
      setReports(res);
    } catch (err) {
      setError(err.error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="font-bold text-xl">My Reports</h2>
      <button onClick={fetchReports} className="bg-blue-500 text-white px-4 py-2">Fetch</button>

      {error && <p className="text-red-500">{error}</p>}
      <ul className="mt-4 space-y-2">
        {reports.map((r, i) => (
          <li key={i} className="border p-2 rounded">{JSON.stringify(r)}</li>
        ))}
      </ul>
    </div>
  );
}
