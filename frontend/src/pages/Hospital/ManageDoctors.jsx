import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctorsByHospital, deleteDoctor } from "../../services/hospitalService";
import { useAuth } from "../../context/useAuth";
import { getUserId, getUserRole } from "../../context/authUser";
import { ArrowLeft, UserRoundPlus, Trash2 } from "lucide-react";

const ManageDoctors = () => {
  const navigate = useNavigate();
  const userId = getUserId();
  const userRole = getUserRole();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const res = await getDoctorsByHospital();
        setDoctors(Array.isArray(res) ? res : []);
      } catch (err) {
        setMessage({
          type: "error",
          text: err.error || "Failed to fetch doctors",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [user]);

  // Trigger modal open
  const confirmDelete = (doctor) => {
    setSelectedDoctor(doctor);
    setShowConfirm(true);
  };


  // inside handleDelete
  const handleDelete = async () => {
    if (!selectedDoctor) return;

    setDeleting(true); // start loading
    try {
      await deleteDoctor({
        doctorId: selectedDoctor.doctorId,
        hospitalId: selectedDoctor.hospitalId,
      });
      setDoctors((prev) =>
        prev.filter((d) => d.doctorId !== selectedDoctor.doctorId)
      );
      setMessage({
        type: "success",
        text: `✅ Doctor ${selectedDoctor.name} deleted successfully!`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.error || "Failed to delete doctor",
      });
    } finally {
      setDeleting(false); // stop loading
      setShowConfirm(false);
      setSelectedDoctor(null);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-8 sm:p-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/hospital/dashboard")}
          className="flex items-center text-gray-600 hover:text-blue-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <UserRoundPlus className="w-12 h-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">Manage Doctors</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            View and manage doctors associated with your hospital
          </p>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`mb-6 text-center ${message.type === "success" ? "text-green-600" : "text-red-500"
              }`}
          >
            {message.text}
          </p>
        )}

        {/* Doctors list */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
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
        ) : doctors.length === 0 ? (
          <p className="text-gray-500 text-center">No doctors found.</p>
        ) : (
          <div className="grid gap-4">
            {doctors.map((doc) => (
              <div
                key={doc.doctorId}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div className="space-y-1">
                  <p className="text-gray-700">
                    <strong>Name:</strong> {doc.name || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Specialization:</strong> {doc.specialization || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Doctor ID:</strong> {doc.doctorId || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Hospital ID:</strong> {doc.hospitalId || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => confirmDelete(doc)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && selectedDoctor && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Delete Doctor
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete Dr.{" "}
              <span className="font-bold">{selectedDoctor.name}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition flex items-center justify-center disabled:opacity-50"
              >
                {deleting ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
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
                ) : (
                  "OK"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
