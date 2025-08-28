import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Sidebar() {
  const { user } = useAuth();

  const menus = {
    doctor: [
      { name: "Dashboard", path: "/doctor" },
      { name: "Create Record", path: "/doctor/create" },
      { name: "My Patients", path: "/doctor/patients" },
    ],
    patient: [
      { name: "Dashboard", path: "/patient" },
      { name: "My Reports", path: "/patient/reports" },
      { name: "My Prescriptions", path: "/patient/prescriptions" },
      { name: "Grant Access", path: "/patient/grant" },
    ],
    hospital: [
      { name: "Dashboard", path: "/hospital" },
      { name: "Register Doctor", path: "/hospital/register-doctor" },
      { name: "Register Patient", path: "/hospital/register-patient" },
    ],
    insurance: [
      { name: "Dashboard", path: "/insurance" },
      { name: "Claims", path: "/insurance/claims" },
      { name: "Register Agent", path: "/insurance/register-agent" },
    ],
    pharma: [
      { name: "Dashboard", path: "/pharma" },
      { name: "Update Stock", path: "/pharma/stock" },
      { name: "Dispense Medicine", path: "/pharma/dispense" },
    ],
    diagnostics: [
      { name: "Dashboard", path: "/diagnostics" },
      { name: "Upload Report", path: "/diagnostics/upload" },
    ],
    researcher: [
      { name: "Dashboard", path: "/researcher" },
      { name: "All Reports", path: "/researcher/reports" },
      { name: "All Prescriptions", path: "/researcher/prescriptions" },
    ],
  };

  const role = user?.role || "guest";

  return (
    <aside className="w-64 bg-gray-100 shadow-md h-screen p-5">
      <h2 className="text-lg font-semibold mb-4">{role.toUpperCase()} Menu</h2>
      <ul className="space-y-3">
        {menus[role]?.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className="block px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-700"
            >
              {item.name}
            </Link>
          </li>
        )) || <p>No menu available</p>}
      </ul>
    </aside>
  );
}
