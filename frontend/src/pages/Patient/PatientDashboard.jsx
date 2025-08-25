import { Link } from "react-router-dom";

export default function PatientDashboard() {
  return (
    <div className="p-6">
      <h2 className="font-bold text-2xl">Patient Dashboard</h2>
      <ul className="mt-6 space-y-2">
        <li><Link to="/patient/grant-access" className="text-blue-500">Grant Access</Link></li>
        <li><Link to="/patient/my-history" className="text-blue-500">My History</Link></li>
        <li><Link to="/patient/my-prescriptions" className="text-blue-500">My Prescriptions</Link></li>
        <li><Link to="/patient/my-reports" className="text-blue-500">My Reports</Link></li>
        <li><Link to="/patient/my-rewards" className="text-blue-500">My Rewards</Link></li>
        <li><Link to="/patient/request-claim" className="text-blue-500">Request Claim</Link></li>
      </ul>
    </div>
  );
}
