import { useState } from "react";
import { getAllPrescriptions } from "../../services/researcherService";
import { Card, CardContent } from "../../components/Card";

export default function AllPrescriptions() {
  const [researcherId, setResearcherId] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllPrescriptions(researcherId);
      console.log("Fetched prescriptions data:", data);
      setPrescriptions(Array.isArray(data) ? data : data.prescriptions || []);
    } catch (err) {
      setError(err.error || "Error fetching prescriptions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Prescriptions</h1>
      <input
        type="text"
        placeholder="Enter Researcher ID"
        value={researcherId}
        onChange={(e) => setResearcherId(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <button
        onClick={fetchPrescriptions}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Load Prescriptions
      </button>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="grid gap-4 mt-4">
        {prescriptions.map((p, i) => (
          <Card key={i}>
          {console.log("Prescription:", p)}
            <CardContent className="p-4">
              <h2 className="font-semibold">{p.prescription}</h2>
              <p>Diagnosis: {p.diagnosis}</p>
              <p>Doctor ID: {p.doctorId}</p>
              <p>Patient ID: {p.patientId}</p>
              <p className="text-sm text-gray-500">
                Created At: {new Date(p.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
