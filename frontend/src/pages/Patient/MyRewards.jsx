import { useState } from "react";
import { getMyRewards } from "../../services/patientService";

export default function MyRewards() {
  const [rewards, setRewards] = useState(0);
  const [message, setMessage] = useState("");

  const fetchRewards = async () => {
    try {
      const res = await getMyRewards();
      setRewards(res.balance || 0);
    } catch (err) {
      setMessage(err.error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="font-bold text-xl">My Rewards</h2>
      <button onClick={fetchRewards} className="bg-blue-500 text-white px-4 py-2">Fetch Rewards</button>
      <p className="mt-2">Reward Points: {rewards}</p>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
