import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/Card";
import { getPatientPrescription } from "../../services/pharmaService";

export default function PharmaDashboard() {
  const [pharmacyId] = useState("pharma123"); // Example ID
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
      const data = await getPatientPrescription(pharmacyId, patientId);
      setPrescriptions(data.prescriptions || []);
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
              <h2 className="font-semibold">{p.medicineName}</h2>
              <p>Dosage: {p.dosage}</p>
              <p>Quantity: {p.quantity}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
