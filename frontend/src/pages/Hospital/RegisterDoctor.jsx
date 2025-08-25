import React, { useState } from "react";
import { registerDoctor } from "../../services/hospitalService";
import { useAuth } from "../../context/AuthContext";

const RegisterDoctor = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    doctorId: "",
    name: "",
    specialization: "",
    city: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerDoctor({ ...form, hospitalId: user.id });
      alert("Doctor registered successfully!");
      setForm({ doctorId: "", name: "", specialization: "", city: "" });
    } catch (err) {
      alert("Doctor registration failed!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🩺 Register Doctor</h1>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <input name="doctorId" value={form.doctorId} onChange={handleChange} placeholder="Doctor ID" className="border p-2 w-full"/>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2 w-full"/>
        <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="Specialization" className="border p-2 w-full"/>
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="border p-2 w-full"/>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default RegisterDoctor;
