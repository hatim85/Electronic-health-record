import { useState, useEffect } from "react";
import { getClaimsByInsuranceCompany, approveClaim } from "../../services/insuranceService";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { ArrowLeft, ClipboardCheck, List, User, X } from "lucide-react";

export default function ClaimList() {
  const navigate = useNavigate();
  const { getLoggedInUserRole } = useAuth();
  const userRole = getLoggedInUserRole();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [insuranceCompanyId, setInsuranceCompanyId] = useState("");
  const [inputError, setInputError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [approveError, setApproveError] = useState("");
  const [approveSuccess, setApproveSuccess] = useState("");

  // Fetch claims on mount for all roles
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getClaimsByInsuranceCompany();
        setClaims(Array.isArray(res) ? res : []);
      } catch (err) {
        setError(err.error || "Error fetching claims");
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  const dismissError = () => setError("");
  const dismissSuccess = () => setSuccess("");

  const openConfirmationModal = (claim) => {
    setSelectedClaim(claim);
    setConfirmationModalOpen(true);
    setApproveError("");
    setApproveSuccess("");
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
    setSelectedClaim(null);
  };

  const handleApprove = async () => {
    if (!selectedClaim.patientId) {
      setApproveError("Patient ID is required");
      return;
    }
    setApproveLoading(true);
    try {
      const res = await approveClaim({ claimId: selectedClaim.claimId, patientId: selectedClaim.patientId });
      setApproveSuccess(`✅ Claim approved: ${res.message || "Success"}`);
      setClaims((prevClaims) => prevClaims.map((c) => c.claimId === selectedClaim.claimId ? { ...c, status: "APPROVED" } : c));
      setTimeout(closeConfirmationModal, 3000); // Close modal after 3 seconds
    } catch (err) {
      setApproveError(`❌ ${err.error || "Failed to approve claim"}`);
    } finally {
      setApproveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          .animate-fadeOut {
            animation: fadeOut 0.5s ease-out forwards;
          }
        `}
      </style>
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl p-6 sm:p-8 lg:p-10 border border-gray-100 animate-fadeIn">
        {/* Header with Back button and Profile icon */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-blue-500 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Title */}
        <div className="flex flex-col items-center mb-10">
          <List className="w-10 h-10 text-blue-500 mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Insurance Claims</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-3 text-center max-w-md">
            View and manage insurance claims
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-500 rounded-lg p-4 mb-6 flex justify-between items-center max-w-md mx-auto w-full">
            <p className="text-red-500 text-sm" role="alert" aria-live="polite">
              {error}
            </p>
            <button
              onClick={dismissError}
              className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              aria-label="Dismiss error"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-500 rounded-lg p-4 mb-6 flex justify-between items-center max-w-md mx-auto w-full animate-fadeIn transition-opacity">
            <p className="text-green-600 text-sm" role="alert" aria-live="polite">
              {success}
            </p>
            <button
              onClick={dismissSuccess}
              className="text-green-600 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
              aria-label="Dismiss success"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Claims list */}
        {loading ? (
          <div className="bg-gray-100/50 rounded-lg p-10 flex items-center justify-center max-w-md mx-auto w-full">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              viewBox="0 0 24 24"
              aria-live="polite"
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
            <span className="ml-3 text-gray-700 text-lg">Loading claims...</span>
          </div>
        ) : claims.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {claims.map((c) => (
              <div
                key={c.claimId}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-blue-50 transition-all duration-200 w-full"
              >
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-sm font-medium text-blue-500">Claim ID</label>
                    <p className="text-gray-700 text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-4rem)]">{c.claimId}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-sm font-medium text-blue-500">Patient ID</label>
                    <p className="text-gray-700 text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-4rem)]">{c.patientId}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-sm font-medium text-blue-500">Status</label>
                    <p className="text-gray-700 text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-4rem)]">{c.status}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-sm font-medium text-blue-500">Amount</label>
                    <p className="text-gray-700 text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-4rem)]">{c.amount}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-sm font-medium text-blue-500">Policy Number</label>
                    <p className="text-gray-700 text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-4rem)]">{c.policyNumber}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-sm font-medium text-blue-500">Reason</label>
                    <p className="text-gray-700 text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-4rem)]">{c.reason}</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  {c.status === "PENDING" && (
                    <button
                      onClick={() => openConfirmationModal(c)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                      aria-label={`Approve claim ${c.claimId}`}
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10" role="status">
            No claims found.
          </p>
        )}

        {/* Confirmation Modal */}
        {confirmationModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
              <button
                onClick={closeConfirmationModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex flex-col items-center mb-6">
                <ClipboardCheck className="w-10 h-10 text-blue-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Approve Claim</h2>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Confirm approval of claim {selectedClaim.claimId} for patient {selectedClaim.patientId}
                </p>
              </div>
              {/* <div className="relative mb-6">
                <input
                  type="text"
                  name="patientId"
                  value={selectedClaim.patientId}
                  onChange={(e) => setSelectedClaim({ ...selectedClaim, patientId: e.target.value })}
                  className={`peer w-full px-4 py-3 border ${
                    approveError ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700 placeholder-transparent`}
                  placeholder="Patient ID"
                  aria-describedby="patientIdError"
                />
                <label
                  className={`absolute left-4 top-3 text-gray-500 text-sm transition-all transform peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-blue-500 bg-white px-1 ${
                    selectedClaim.patientId ? "top-[-8px] text-sm text-blue-500" : ""
                  }`}
                >
                  Patient ID
                </label>
              </div> */}
              {approveError && (
                <p className="text-red-500 text-xs mb-4">{approveError}</p>
              )}
              {approveSuccess && (
                <p className="text-green-600 text-xs mb-4">{approveSuccess}</p>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeConfirmationModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                  aria-label="Cancel approval"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={approveLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium flex items-center"
                  aria-label="Confirm approval"
                >
                  {approveLoading && (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
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
                  )}
                  {approveLoading ? "Approving..." : "OK"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}