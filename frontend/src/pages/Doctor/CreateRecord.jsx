import { useState } from "react";
import { createPatientRecord } from "../../services/doctorService";

export default function CreateRecord() {
  const [formData, setFormData] = useState({
    doctorId: "",
    patientId: "",
    diagnosis: "",
    prescription: "",
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPatientRecord(formData);
      setMessage("Patient record created successfully!");
    } catch (err) {
      setMessage(err.error || "Failed to create patient record");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Create Patient Record</h2>
      {message && <p className="mb-3 text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="doctorId"
          placeholder="Doctor ID"
          value={formData.doctorId}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <input
          name="patientId"
          placeholder="Patient ID"
          value={formData.patientId}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <textarea
          name="diagnosis"
          placeholder="Diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <textarea
          name="prescription"
          placeholder="Prescription"
          value={formData.prescription}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Create Record
        </button>
      </form>
    </div>
  );
}
