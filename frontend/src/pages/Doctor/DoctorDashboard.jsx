import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Stethoscope, FilePlus, Edit, Users, User } from "lucide-react";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl p-6 sm:p-8 lg:p-10 border border-gray-100">
        {/* Header with Back button and Profile icon */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            aria-label="View Profile"
          >
            <User className="w-6 h-6" />
          </button>
        </div>

        {/* Title */}
        <div className="flex flex-col items-center mb-10">
          <Stethoscope className="w-12 h-12 text-blue-600 mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Doctor Dashboard</h1>
          <p className="text-sm text-gray-500 mt-3 text-center max-w-md">
            Manage patient records and view your patients with ease and security
          </p>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              label: "Create Patient Record",
              path: "/doctor/create-record",
              icon: FilePlus,
            },
            {
              label: "Update Patient Record",
              path: "/doctor/update-record",
              icon: Edit,
            },
            {
              label: "My Patients",
              path: "/doctor/my-patients",
              icon: Users,
            },
          ].map((action, idx) => (
            <Link
              key={idx}
              to={action.path}
              className="group flex items-center justify-center px-4 py-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:bg-blue-50 transition-all duration-200 text-gray-800 font-semibold text-lg"
            >
              <action.icon className="w-6 h-6 text-blue-600 mr-3 group-hover:scale-110 transition-transform duration-200" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}