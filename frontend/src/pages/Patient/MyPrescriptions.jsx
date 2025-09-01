import { useState } from "react";
import { getMyPrescriptions } from "../../services/patientService";

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState("");

  const fetchPrescriptions = async () => {
    try {
      const res = await getMyPrescriptions();
      setPrescriptions(res);
    } catch (err) {
      setError(err.error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="font-bold text-xl">My Prescriptions</h2>
      <button onClick={fetchPrescriptions} className="bg-blue-500 text-white px-4 py-2">Fetch</button>

      {error && <p className="text-red-500">{error}</p>}
      <ul className="mt-4 space-y-2">
        {prescriptions.map((p, i) => (
          <li key={i} className="border p-2 rounded">{JSON.stringify(p)}</li>
        ))}
      </ul>
    </div>
  );
}
