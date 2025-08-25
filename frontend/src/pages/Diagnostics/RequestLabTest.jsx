import { useState } from "react";
// import { requestLabTest } from "../../services/diagnosticsService";

export default function RequestLabTest() {
  // const [formData, setFormData] = useState({
  //   patientId: "",
  //   testType: "",
  // });
  // const [message, setMessage] = useState(null);

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await requestLabTest(formData);
  //     setMessage("Lab test request submitted!");
  //   } catch (err) {
  //     setMessage("Failed to request lab test");
  //   }
  // };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Request Lab Test</h2>

      {message && <p className="mb-3 text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="patientId"
          placeholder="Patient ID"
          value={formData.patientId}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />

        <input
          type="text"
          name="testType"
          placeholder="Test Type (e.g. X-Ray)"
          value={formData.testType}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
        >
          Request
        </button>
      </form>
    </div>
  );
}
