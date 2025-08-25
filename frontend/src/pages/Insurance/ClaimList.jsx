import React, { useState } from "react";
import { getClaimsByInsuranceCompany } from "../../services/insuranceService";
import { Link } from "react-router-dom";

const ClaimList = () => {
  const [company, setCompany] = useState("");
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState("");

  const fetchClaims = async () => {
    try {
      const res = await getClaimsByInsuranceCompany(company);
      setClaims(res);
    } catch (err) {
      setError(err.error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Insurance Claims</h2>
      <input
        placeholder="Insurance Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={fetchClaims} className="bg-yellow-500 text-white px-4 py-2 rounded">Fetch</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <ul className="mt-4 space-y-2">
        {claims.map((c) => (
          <li key={c.claimId} className="border p-3 flex justify-between">
            <span>
              Claim ID: {c.claimId} | Patient: {c.patientId} | Status: {c.status}
            </span>
            {c.status === "PENDING" && (
              <Link to={`/insurance/approve-claim/${c.claimId}`} className="text-blue-600 underline">
                Approve
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClaimList;
