import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          You are not logged in. Please login to continue.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }


  const role = user.role;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = {
    doctor: [
      { label: "Doctor Dashboard", path: "/doctor/dashboard" },
      { label: "View Patients", path: "/doctor/patients" },
      { label: "Write Prescription", path: "/doctor/prescriptions" },
    ],
    patient: [
      { label: "Patient Dashboard", path: "/patient/dashboard" },
      { label: "My Records", path: "/patient/records" },
      { label: "My Insurance", path: "/patient/insurance" },
    ],
    diagnostics: [
      { label: "Diagnostics Dashboard", path: "/diagnostics/dashboard" },
      { label: "Upload Lab Report", path: "/diagnostics/upload" },
      { label: "All Reports", path: "/diagnostics/reports" },
    ],
    insurance: [
      { label: "Insurance Dashboard", path: "/insurance/dashboard" },
      { label: "Register Agent", path: "/insurance/register-agent" },
      { label: "Issue Insurance", path: "/insurance/issue" },
      { label: "Claims List", path: "/insurance/claims" },
      { label: "Approve Claim", path: "/insurance/approve-claim" },
    ],
    pharma: [
      { label: "Pharma Dashboard", path: "/pharma/dashboard" },
      { label: "Dispense Medicine", path: "/pharma/dispense" },
      { label: "Update Stock", path: "/pharma/update-stock" },
    ],
    researcher: [
      { label: "Researcher Dashboard", path: "/researcher/dashboard" },
      { label: "All Prescriptions", path: "/researcher/prescriptions" },
      { label: "All Lab Reports", path: "/researcher/lab-reports" },
      { label: "Process Data", path: "/researcher/process-data" },
    ],
    admin: [
      { label: "Admin Dashboard", path: "/admin/dashboard" },
      { label: "Manage Users", path: "/admin/users" },
      { label: "System Logs", path: "/admin/logs" },
    ],
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <p className="mb-4">
        Welcome, <span className="font-semibold">{user.username}</span> (
        <span className="capitalize">{role}</span>)
      </p>

      <div className="grid gap-4">
        {(navItems[role] || []).map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className="w-full text-left px-4 py-3 border rounded hover:bg-gray-100"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
