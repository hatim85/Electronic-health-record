import React from "react";
import { Link } from "react-router-dom";

const InsuranceDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Insurance Dashboard</h1>
      <div className="grid grid-cols-2 gap-6">
        <Link to="/insurance/register-agent" className="p-4 border rounded bg-blue-100 hover:bg-blue-200">
          Register Agent
        </Link>
        <Link to="/insurance/issue-insurance" className="p-4 border rounded bg-green-100 hover:bg-green-200">
          Issue Insurance
        </Link>
        <Link to="/insurance/claims" className="p-4 border rounded bg-yellow-100 hover:bg-yellow-200">
          View Claims
        </Link>
      </div>
    </div>
  );
};

export default InsuranceDashboard;
