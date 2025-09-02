import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyClaims } from "../../services/patientService";
import { ArrowLeft, Receipt } from "lucide-react";

export default function MyClaims() {
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
        const res = await getMyClaims();
        setClaims(Array.isArray(res) ? res : []);
      } catch (err) {
        setError(`❌ ${err.error || "Failed to load claims"}`);
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
          onClick={() => navigate("/patient/dashboard")}
          className="flex items-center text-gray-600 hover:text-blue-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <Receipt className="w-12 h-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">My Insurance Claims</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            View all your insurance claims
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
        ) : claims.length === 0 ? (
          <p className="text-gray-500 text-center">No claims found.</p>
        ) : (
          <div className="grid gap-4">
            {claims.map((c, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2"
              >
                <p className="text-gray-700">
                  <strong>Claim ID:</strong> {c.claimId}
                </p>
                <p className="text-gray-700">
                  <strong>Policy Number:</strong> {c.policyNumber}
                </p>
                <p className="text-gray-700">
                  <strong>Amount:</strong> ${c.amount}
                </p>
                <p className="text-gray-700">
                  <strong>Reason:</strong> {c.reason}
                </p>
                <p className="text-gray-700">
                  <strong>Status:</strong> {c.status}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Requested At:</strong>{" "}
                  {c.requestedAt ? new Date(c.requestedAt).toLocaleString() : "N/A"}
                </p>
                {c.approvedAt && (
                  <p className="text-sm text-gray-500">
                    <strong>Approved At:</strong>{" "}
                    {new Date(c.approvedAt).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}