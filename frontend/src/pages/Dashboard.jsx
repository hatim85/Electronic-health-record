import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Lock, Users, Database, Shield, Stethoscope, FlaskConical } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, getLoggedInUserRole } = useAuth();

  // Determine navigation path based on user role
  const getDashboardPath = () => {
    if (!user) return "/login";
    const userRole = getLoggedInUserRole();
    const roleDashboardMap = {
      superAdmin: "/hospital/dashboard",
      hospital: "/hospital/dashboard",
      patient: "/patient/dashboard",
      diagnostics: "/diagnostics/dashboard",
      doctor: "/doctor/dashboard",
      pharmacy: "/pharma/dashboard",
      researcher: "/researcher/dashboard",
      researchAdmin: "/research/dashboard",
      insuranceAdmin: "/insurance/dashboard",
      insuranceCompany: "/insurance/dashboard",
      insuranceAgent: "/insurance/dashboard",
    };
    return roleDashboardMap[userRole] || "/login"; // Fallback to /login if role is unknown
  };

  // Button label based on authentication status
  const buttonLabel = user ? "Go to Dashboard" : "Login";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">EHR Blockchain</h1>
          </div>
          <button
            onClick={() => navigate(getDashboardPath())}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {buttonLabel}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Welcome to EHR Blockchain System
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mb-8">
          Securely manage and share Electronic Health Records using blockchain technology. 
          Empower doctors, patients, hospitals, insurance agents, diagnostics, and researchers 
          with a trusted, decentralized platform.
        </p>
        <button
          onClick={() => navigate(getDashboardPath())}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition font-semibold text-lg shadow-md"
        >
          {buttonLabel}
        </button>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Why Choose EHR Blockchain?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "Secure Data",
                description: "Blockchain technology ensures your health records are tamper-proof and secure.",
              },
              {
                icon: Users,
                title: "Multi-User Access",
                description: "Doctors, patients, hospitals, and more can access records securely based on roles.",
              },
              {
                icon: Database,
                title: "Decentralized Storage",
                description: "Distributed ledger ensures data availability and integrity across the network.",
              },
              {
                icon: Stethoscope,
                title: "Doctor-Friendly",
                description: "Easily create, update, and manage patient records with a user-friendly interface.",
              },
              {
                icon: Shield,
                title: "Insurance Integration",
                description: "Seamlessly issue policies and manage claims with built-in insurance tools.",
              },
              {
                icon: FlaskConical,
                title: "Research Support",
                description: "Researchers can access anonymized data for studies while maintaining privacy.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Join the Future of Healthcare
          </h2>
          <p className="text-lg mb-8">
            Sign up today to experience secure, efficient, and decentralized health record management.
          </p>
          <button
            onClick={() => navigate(getDashboardPath())}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition font-semibold text-lg shadow-md"
          >
            {buttonLabel}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold">EHR Blockchain System</h3>
            <p className="text-sm text-gray-400">
              © 2025 EHR Blockchain. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}