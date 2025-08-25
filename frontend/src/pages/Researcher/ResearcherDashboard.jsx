import { useState } from "react";

export default function ResearcherDashboard() {
  const [researcherId] = useState("researcher123"); // example ID

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Researcher Dashboard</h1>
      <p>Welcome, Researcher <span className="font-semibold">{researcherId}</span></p>
      <p className="mt-2 text-gray-700">
        Use the navigation to view prescriptions, lab reports, or submit processed data.
      </p>
    </div>
  );
}
