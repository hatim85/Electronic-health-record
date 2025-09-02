import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { ArrowLeft, Shield, UserPlus, FilePlus, List, User } from "lucide-react";

export default function InsuranceDashboard() {
  const navigate = useNavigate();
  const { getLoggedInUserRole } = useAuth();
  const userRole = getLoggedInUserRole();

  const adminActions = [
    { label: "Register Company", path: "/insurance/register-company", icon: Shield },
    { label: "Register Agent", path: "/insurance/register-agent", icon: UserPlus },
  ];

  const agentActions = [
    { label: "Issue Insurance", path: "/insurance/issue", icon: FilePlus },
    { label: "View Claims", path: "/insurance/claims", icon: List },
  ];

  const actions = userRole === "insuranceAdmin" ? adminActions : userRole === "insuranceAgent" ? agentActions : [];

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
        `}
      </style>
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl p-6 sm:p-8 lg:p-10 border border-gray-100 animate-fadeIn">
        {/* Header with Back button and Profile icon */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            aria-label="View Profile"
          >
            <User className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div className="flex flex-col items-center mb-10">
          <Shield className="w-10 h-10 text-blue-500 mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Insurance Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-3 text-center max-w-md">
            {userRole === "insuranceCompany"
              ? "View your insurance company profile and details"
              : "Manage insurance policies and claims with secure, streamlined access"}
          </p>
        </div>

        {/* Action buttons or restricted message */}
        {userRole === "insuranceCompany" ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600 font-medium">
              No actions are available for the Insurance Company role.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please contact an Insurance Admin for further assistance or view your profile for details.
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold"
            >
              View Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {actions.map((action, idx) => (
              <Link
                key={idx}
                to={action.path}
                className="group flex items-center justify-center px-4 py-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-gray-800 font-semibold text-lg"
              >
                <action.icon className="w-6 h-6 text-blue-500 mr-3 group-hover:scale-110 transition-transform duration-200" />
                {action.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}