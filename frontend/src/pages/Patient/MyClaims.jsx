import { useState } from "react";
import { getMyClaims } from "../../services/patientService";

export default function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState("");

  const fetchClaims = async () => {
    try {
      const res = await getMyClaims();
      setClaims(res);
      setError("");
    } catch (err) {
      setError(err.error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="font-bold text-xl">My Insurance Claims</h2>
      <button
        onClick={fetchClaims}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Fetch
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <ul className="mt-4 space-y-2">
        {claims.map((c, i) => (
          <li key={i} className="border p-3 rounded bg-gray-50">
            <p><strong>Claim ID:</strong> {c.claimId}</p>
            <p><strong>Policy:</strong> {c.policyNumber}</p>
            <p><strong>Amount:</strong> {c.amount}</p>
            <p><strong>Reason:</strong> {c.reason}</p>
            <p><strong>Status:</strong> {c.status}</p>
            <p><strong>Requested At:</strong> {c.requestedAt}</p>
            {c.approvedAt && <p><strong>Approved At:</strong> {c.approvedAt}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
