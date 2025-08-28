import { Link } from "react-router-dom";

export default function DoctorDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/doctor/create-record"
          className="bg-blue-500 text-white p-6 rounded-2xl shadow hover:bg-blue-600"
        >
          Create Patient Record
        </Link>
        <Link
          to="/doctor/update-record"
          className="bg-yellow-500 text-white p-6 rounded-2xl shadow hover:bg-yellow-600"
        >
          Update Patient Record
        </Link>
        <Link
          to="/doctor/my-patients"
          className="bg-green-500 text-white p-6 rounded-2xl shadow hover:bg-green-600"
        >
          My Patients
        </Link>
      </div>
    </div>
  );
}
