import { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function FraudHeatmap({ apiUrl }) {
  const [data, setData] = useState({});
  const canvasId = "fraud-heatmap";

  useEffect(() => {
    fetch(`${apiUrl}/dashboard/ai/fraud-heatmap`)
      .then((r) => r.json())
      .then((map) => {
        setData(map);
        renderHeatmap(map);
      });
  }, []);

  function renderHeatmap(map) {
    const ctx = document.getElementById(canvasId);

    const labels = Object.keys(map);
    const values = Object.values(map);

    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Fraud Density",
            data: values,
            backgroundColor: values.map((v) =>
              v >= 6 ? "#dc2626" :      // HIGH (red)
              v >= 3 ? "#f59e0b" :      // MEDIUM (yellow)
                       "#16a34a"        // LOW (green)
            ),
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { ticks: { color: "#374151" } },
          y: { ticks: { color: "#374151" } },
        },
      },
    });
  }

  return (
    <div className="bg-white border rounded shadow p-4">
      <h2 className="text-lg font-bold mb-4">Fraud Heatmap</h2>
      <canvas id={canvasId} height="120"></canvas>
    </div>
  );
}
