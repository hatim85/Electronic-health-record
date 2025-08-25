import React, { useState } from "react";
import { registerPharmacy } from "../../services/hospitalService";
import { useAuth } from "../../context/AuthContext";

const RegisterPharmacy = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    pharmacyId: "",
    name: "",
    city: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerPharmacy({ ...form, hospitalId: user.id });
      alert("Pharmacy registered successfully!");
      setForm({ pharmacyId: "", name: "", city: "" });
    } catch (err) {
      alert("Pharmacy registration failed!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">💊 Register Pharmacy</h1>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <input name="pharmacyId" value={form.pharmacyId} onChange={handleChange} placeholder="Pharmacy ID" className="border p-2 w-full"/>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2 w-full"/>
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="border p-2 w-full"/>
        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default RegisterPharmacy;
