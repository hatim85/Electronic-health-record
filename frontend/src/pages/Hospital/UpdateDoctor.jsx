import React, { useState } from "react";
import { updateDoctor } from "../../services/hospitalService";

const UpdateDoctor = () => {
  const [form, setForm] = useState({
    doctorId: "",
    hospitalId: "",
    name: "",
    specialization: "",
    city: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoctor(form);
      alert("👨‍⚕️ Doctor updated successfully!");
      setForm({
        doctorId: "",
        hospitalId: "",
        name: "",
        specialization: "",
        city: "",
      });
    } catch (err) {
      alert(err.error || "Doctor update failed!");
    }
  };

  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">👨‍⚕️ Update Doctor</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            name="doctorId"
            value={form.doctorId}
            onChange={handleChange}
            placeholder="Doctor ID"
            className="border p-2 w-full rounded-lg"
            required
          />
          <input
            name="hospitalId"
            value={form.hospitalId}
            onChange={handleChange}
            placeholder="Hospital ID"
            className="border p-2 w-full rounded-lg"
            required
          />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Doctor Name"
            className="border p-2 w-full rounded-lg"
            required
          />
          <input
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            placeholder="Specialization"
            className="border p-2 w-full rounded-lg"
            required
          />
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="border p-2 w-full rounded-lg"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700"
          >
            Update Doctor
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateDoctor;
