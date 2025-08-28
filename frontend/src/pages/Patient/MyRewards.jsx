import { useState } from "react";
import { getMyRewards, useReward } from "../../services/patientService";

export default function MyRewards() {
  const [patientId, setPatientId] = useState("");
  const [userId, setUserId] = useState("");
  const [rewards, setRewards] = useState(0);
  const [treatmentId, setTreatmentId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const fetchRewards = async () => {
    try {
      const res = await getMyRewards({ patientId, userId });
      setRewards(res.balance || 0);
    } catch (err) {
      setMessage(err.error);
    }
  };


  const handleUse = async () => {
    try {
      const res = await useReward({ userId, patientId, treatmentId, amount });
      setMessage(`Reward used: ${JSON.stringify(res)}`);
    } catch (err) {
      setMessage(err.error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="font-bold text-xl">My Rewards</h2>
      <input placeholder="Patient ID" className="border p-2 mr-2" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
      <input placeholder="User ID" className="border p-2 mr-2" value={userId} onChange={(e) => setUserId(e.target.value)} />
      <button onClick={fetchRewards} className="bg-blue-500 text-white px-4 py-2">Fetch Rewards</button>
      <p className="mt-2">Reward Points: {rewards}</p>

      <h3 className="mt-4 font-semibold">Use Reward Points</h3>
      <input placeholder="Treatment ID" className="border p-2 mr-2" value={treatmentId} onChange={(e) => setTreatmentId(e.target.value)} />
      <input placeholder="Amount" className="border p-2 mr-2" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleUse} className="bg-green-500 text-white px-4 py-2">Use</button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
