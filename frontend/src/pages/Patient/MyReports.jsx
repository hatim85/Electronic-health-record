import { useState } from "react";
import { getMyReports } from "../../services/patientService";

export default function MyReports() {
  const [patientId, setPatientId] = useState("");
  const [userId, setUserId] = useState("");
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      const res = await getMyReports({ patientId, userId });
      setReports(res);
    } catch (err) {
      setError(err.error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="font-bold text-xl">My Reports</h2>
      <input placeholder="Patient ID" className="border p-2 mr-2" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
      <input placeholder="User ID" className="border p-2 mr-2" value={userId} onChange={(e) => setUserId(e.target.value)} />
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
