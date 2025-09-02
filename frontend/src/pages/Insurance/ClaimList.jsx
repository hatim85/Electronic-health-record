import { useState, useEffect } from "react";
import { getClaimsByInsuranceCompany } from "../../services/insuranceService";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, List } from "lucide-react";

export default function ClaimList() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch claims on mount
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getClaimsByInsuranceCompany();
        setClaims(Array.isArray(res) ? res : []);
      } catch (err) {
        setError(`❌ ${err.error || "Error fetching claims"}`);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-8 sm:p-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/insurance/dashboard")}
          className="flex items-center text-gray-600 hover:text-blue-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <List className="w-12 h-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">Insurance Claims</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            View all insurance claims
          </p>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        {/* Claims list */}
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
            Loading claims...
          </p>
        ) : claims.length > 0 ? (
          <div className="grid gap-4">
            {claims.map((c) => (
              <div
                key={c.claimId}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div className="space-y-1">
                  <p className="text-gray-700">
                    <strong>Claim ID:</strong> {c.claimId}
                  </p>
                  <p className="text-gray-700">
                    <strong>Patient ID:</strong> {c.patientId}
                  </p>
                  <p className="text-gray-700">
                    <strong>Status:</strong> {c.status}
                  </p>
                </div>
                {c.status === "PENDING" && (
                  <Link
                    to={`/insurance/approve-claim/${c.claimId}`}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Approve
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No claims found.</p>
        )}
      </div>
    </div>
  );
}