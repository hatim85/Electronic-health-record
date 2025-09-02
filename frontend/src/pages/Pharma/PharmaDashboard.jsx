import { useNavigate } from "react-router-dom";
import PrescriptionFetcher from "./PrescriptionFetcher";
import { ArrowLeft, Package, Pill, Syringe, User } from "lucide-react";

export default function PharmaDashboard() {
  const navigate = useNavigate();

  const pharmaActions = [
    { label: "Dispense Medicine", path: "/pharma/dispense", color: "green" },
    { label: "Update Stock", path: "/pharma/update-stock", color: "blue" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-8 sm:p-10">
        {/* Header with Back button and Profile icon */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-blue-600 transition"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-600 hover:text-blue-600 transition"
            aria-label="View Profile"
          >
            <User className="w-6 h-6" />
          </button>
        </div>

        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <Pill className="w-12 h-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">Pharmacy Dashboard</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Manage pharmacy operations and patient prescriptions
          </p>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {pharmaActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => navigate(action.path)}
              className={`flex items-center justify-center px-4 py-3 rounded-lg text-white font-semibold shadow hover:opacity-90 transition text-lg ${
                action.color === "green" ? "bg-green-600" : "bg-blue-600"
              }`}
            >
              {action.color === "green" ? (
                <Syringe className="w-5 h-5 mr-2" />
              ) : (
                <Package className="w-5 h-5 mr-2" />
              )}
              {action.label}
            </button>
          ))}
        </div>

        {/* Prescription fetcher */}
        <PrescriptionFetcher />
      </div>
    </div>
  );
}