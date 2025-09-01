import { useState } from "react";
import { getMyHistory } from "../../services/patientService";

export default function MyHistory() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      const res = await getMyHistory();
      setHistory(res);
    } catch (err) {
      setError(err.error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="font-bold text-xl">My Treatment History</h2>
      <button onClick={fetchHistory} className="bg-blue-500 text-white px-4 py-2">Fetch</button>

      {error && <p className="text-red-500">{error}</p>}
      <ul className="mt-4 space-y-2">
        {history.map((h, i) => (
          <li key={i} className="border p-2 rounded">{JSON.stringify(h)}</li>
        ))}
      </ul>
    </div>
  );
}
