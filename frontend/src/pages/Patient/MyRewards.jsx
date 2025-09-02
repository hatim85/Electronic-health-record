import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRewards } from "../../services/patientService";
import { ArrowLeft, Award } from "lucide-react";

export default function MyRewards() {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch rewards on mount
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true);
        setMessage("");
        const res = await getMyRewards();
        setRewards(res.balance || 0);
      } catch (err) {
        setMessage(`❌ ${err.error || "Failed to load rewards"}`);
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-lg p-8 sm:p-10">
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
          <Award className="w-12 h-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">My Rewards</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            View your reward points
          </p>
        </div>

        {/* Message */}
        {message && (
          <p className="text-red-500 text-center mb-6">{message}</p>
        )}

        {/* Rewards display */}
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
            Loading rewards...
          </p>
        ) : (
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-800">
              Reward Points: {rewards}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}