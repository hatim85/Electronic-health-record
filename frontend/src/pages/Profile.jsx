import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { ArrowLeft, User, LogOut } from "lucide-react";

const Profile = () => {
  const { user, logout, getLoggedInUserId, getLoggedInUserRole } = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get user details
  const userId = getLoggedInUserId();
  const userRole = getLoggedInUserRole();

  // Role display names for better readability
  const roleDisplayNames = {
    superAdmin: "Super Admin",
    hospital: "Hospital",
    patient: "Patient",
    diagnostics: "Diagnostics",
    doctor: "Doctor",
    pharmacy: "Pharmacy",
    researcher: "Researcher",
    researchAdmin: "Research Admin",
    insuranceAdmin: "Insurance Admin",
    insuranceCompany: "Insurance Company",
    insuranceAgent: "Insurance Agent",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-lg p-8 sm:p-10">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 transition mb-6"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <User className="w-12 h-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            View your account details below
          </p>
        </div>

        {/* Profile Details */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-medium text-gray-700">User ID</h2>
            <p className="text-gray-900">{userId || "N/A"}</p>
          </div>
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-medium text-gray-700">Role</h2>
            <p className="text-gray-900">
              {roleDisplayNames[userRole] || userRole || "N/A"}
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-lg flex items-center justify-center"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;