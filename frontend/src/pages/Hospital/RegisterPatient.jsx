import React, { useState } from "react";
import { registerPatient } from "../../services/hospitalService";
import { useAuth } from "../../context/useAuth";

const RegisterPatient = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    hospitalId: "",
    patientId: "",
    name: "",
    dob: "",
    gender: "",
    city: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerPatient({ ...form });
      alert("Patient registered successfully!");
      setForm({ patientId: "", name: "", dob: "", gender: "", city: "" });
    } catch (err) {
      alert("Patient registration failed!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🧑 Register Patient</h1>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <input
          name="hospitalId"
          value={form.hospitalId}
          onChange={handleChange}
          placeholder="Hospital ID"
          className="border p-2 w-full"
        />
        <input
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          placeholder="Patient ID"
          className="border p-2 w-full"
        />
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 w-full"
        />
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="gender"
          value={form.gender}
          onChange={handleChange}
          placeholder="Gender"
          className="border p-2 w-full"
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPatient;
