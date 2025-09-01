import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/Card";
import { getPatientPrescription } from "../../services/pharmaService";

export default function PharmaDashboard() {
  const [patientId, setPatientId] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPrescription = async () => {
    if (!patientId) {
      setError("Enter a Patient ID");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await getPatientPrescription(patientId);
      console.log("Fetched prescription data:", data);
      setPrescriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.error || "Error fetching prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Pharmacy Dashboard</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchPrescription}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Fetch
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-4">
        {prescriptions.map((p, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <h2 className="font-semibold">{p.prescription}</h2>
              <p>Diagnosis: {p.diagnosis}</p>
              <p>Doctor: {p.doctorId}</p>
              <p>Record ID: {p.recordId}</p>
              <p className="text-sm text-gray-500">
                Created: {new Date(p.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
