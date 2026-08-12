import FraudGraph from "./FraudGraph";
import { useEffect, useState } from "react";

export default function FraudPage({ ownerId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/fraud/owner/${ownerId}`)
      .then(res => res.json())
      .then(setData);
  }, [ownerId]);

  return (
    <div className="p-6">
      {data ? <FraudGraph data={data.graph} /> : "Loading graph…"}
    </div>
  );
}
