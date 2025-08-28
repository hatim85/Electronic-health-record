import { useState } from "react";
import { registerInsuranceCompany } from "../../services/insuranceService";

const RegisterInsuranceCompany = () => {
  const [form, setForm] = useState({
    companyId: "",
    name: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await registerInsuranceCompany(form);
      setMessage({ type: "success", text: res.message || "Company registered successfully" });
      setForm({ companyId: "", name: "", city: "" }); // reset form
    } catch (error) {
      setMessage({ type: "error", text: error.error || "Failed to register company" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Register Insurance Company</h2>
      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Company ID</label>
          <input
            type="text"
            name="companyId"
            value={form.companyId}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register Company"}
        </button>
      </form>
    </div>
  );
};

export default RegisterInsuranceCompany;
