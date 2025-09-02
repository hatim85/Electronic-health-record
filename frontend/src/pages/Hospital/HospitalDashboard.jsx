import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDoctorsByHospital,
  getPatientsByHospital,
} from "../../services/hospitalService";
import { getUserId, getUserRole } from "../../context/authUser";
import { ArrowLeft, Hospital, Stethoscope, UserPlus, Pill, Microscope, X, User } from "lucide-react";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null); // "doctors" | "patients" | null
  const [message, setMessage] = useState(null);

  // Fetch data on mount for hospital role only
  useEffect(() => {
    if (userRole === "hospital") {
      const fetchData = async () => {
        setLoading(true);
        setMessage(null);
        try {
          const doctorRes = await getDoctorsByHospital();
          setDoctors(Array.isArray(doctorRes) ? doctorRes : []);
          const patientRes = await getPatientsByHospital();
          setPatients(Array.isArray(patientRes) ? patientRes : []);
        } catch (err) {
          setMessage({
            type: "error",
            text: err.error || "Failed to load dashboard data",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setLoading(false); // No data to fetch for superAdmin
    }
  }, [userRole]);

  // Actions for roles
  const superAdminActions = [
    { label: "Register Hospital", path: "/hospital/register-hospital", icon: Hospital },
    { label: "Register Doctor", path: "/hospital/register-doctor", icon: Stethoscope },
    { label: "Register Patient", path: "/hospital/register-patient", icon: UserPlus },
    { label: "Register Pharmacy", path: "/hospital/register-pharmacy", icon: Pill },
    { label: "Register Diagnostics", path: "/hospital/register-diagnostics", icon: Microscope },
  ];

  const hospitalActions = [
    { label: "Manage Doctors", path: "/hospital/manage-doctors", icon: Stethoscope },
    { label: "Update Doctor", path: "/hospital/update-doctor", icon: UserPlus },
  ];

  const actions = userRole === "superAdmin" ? superAdminActions : hospitalActions;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-8 sm:p-10">
        {/* Header with Back button and Profile icon */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-blue-600 transition"
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
          <Hospital className="w-12 h-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">
            {userRole === "superAdmin" ? "Super Admin Dashboard" : "Hospital Dashboard"}
          </h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            {userRole === "superAdmin"
              ? "Manage system-wide registrations and configurations"
              : "Manage hospital operations, doctors, and patients"}
          </p>
        </div>

        {/* Error Message */}
        {message && (
          <p className={`mb-6 text-center ${message.type === "error" ? "text-red-500" : "text-green-600"}`}>
            {message.text}
          </p>
        )}

        {/* Doctors and Patients Cards (only for hospital role) */}
        {userRole === "hospital" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {/* Doctors Card */}
            <div
              className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => !loading && setModalType("doctors")}
            >
              <Stethoscope className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800">Doctors</h3>
              {loading ? (
                <div className="flex justify-center mt-2">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-600"
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
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-800">{doctors.length}</p>
              )}
            </div>

            {/* Patients Card */}
            <div
              className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => !loading && setModalType("patients")}
            >
              <UserPlus className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800">Patients</h3>
              {loading ? (
                <div className="flex justify-center mt-2">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-600"
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
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-800">{patients.length}</p>
              )}
            </div>
          </div>
        )}

        {/* Actions Section */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {userRole === "superAdmin" ? "Super Admin Actions" : "Hospital Actions"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col items-center hover:shadow-lg hover:bg-blue-50 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(action.path)}
              >
                <Icon className="w-8 h-8 text-blue-600 mb-3" />
                <p className="text-gray-800 font-medium text-center">{action.label}</p>
              </div>
            );
          })}
        </div>

        {/* Modal (only for hospital role) */}
        {modalType && userRole === "hospital" && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
              {/* Close button */}
              <button
                onClick={() => setModalType(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Title */}
              <div className="flex items-center mb-4">
                {modalType === "doctors" ? (
                  <Stethoscope className="w-6 h-6 text-blue-600 mr-2" />
                ) : (
                  <UserPlus className="w-6 h-6 text-blue-600 mr-2" />
                )}
                <h2 className="text-xl font-bold text-gray-800">
                  {modalType === "doctors" ? "Doctors List" : "Patients List"}
                </h2>
              </div>

              {/* Modal Content */}
              <div className="max-h-80 overflow-y-auto space-y-4">
                {(modalType === "doctors" ? doctors : patients).length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No records found.</p>
                ) : (
                  (modalType === "doctors" ? doctors : patients).map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200"
                    >
                      {modalType === "doctors" ? (
                        <>
                          <p className="text-gray-800 font-semibold">{item.name || "N/A"}</p>
                          <p className="text-sm text-gray-600">
                            {item.specialization || "N/A"} • {item.city || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">Doctor ID: {item.doctorId || "N/A"}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-800 font-semibold">{item.name || "N/A"}</p>
                          <p className="text-sm text-gray-600">{item.city || "N/A"}</p>
                          <p className="text-sm text-gray-500">Patient ID: {item.patientId || "N/A"}</p>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard;