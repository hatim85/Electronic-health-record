import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Pill,
  ClipboardList,
  Award,
  ShieldCheck,
  Users,
  ReceiptText,
  ArrowLeft,
  User,
} from "lucide-react";

const features = [
  { label: "Grant Access", path: "/patient/grant-access", icon: Users },
  { label: "My History", path: "/patient/history", icon: ClipboardList },
  { label: "My Prescriptions", path: "/patient/prescriptions", icon: Pill },
  { label: "My Reports", path: "/patient/reports", icon: FileText },
  { label: "My Rewards", path: "/patient/rewards", icon: Award },
  { label: "Request Claim", path: "/patient/request-claim", icon: ShieldCheck },
  { label: "My Claims", path: "/patient/view-claims", icon: ReceiptText },
];
export default function PatientDashboard() {
  const navigate=useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6">
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
            onClick={() => window.location.href = "/profile"}
            className="text-gray-600 hover:text-blue-600 transition"
            aria-label="View Profile"
          >
            <User className="w-6 h-6" />
          </button>
        </div>

        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <Users className="w-12 h-12 text-blue-600 mb-3" />
          <h2 className="text-3xl font-bold text-gray-800">Patient Dashboard</h2>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Manage your health records, prescriptions, and claims
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg hover:bg-blue-50 transition"
            >
              <Icon className="w-10 h-10 text-blue-600 mb-3" />
              <span className="font-medium text-gray-800">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}