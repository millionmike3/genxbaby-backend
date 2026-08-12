import { useState } from "react";

export default function FraudInvestigatorChat({ apiUrl }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);

    const res = await fetch(`${apiUrl}/dashboard/ai/investigator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    });

    const data = await res.json();

    const aiMsg = { sender: "ai", text: data.answer };
    setMessages(prev => [...prev, aiMsg]);

    setInput("");
  }

  return (
    <div className="bg-white border rounded shadow p-6 space-y-4">
      <h2 className="text-xl font-bold">AI Fraud Investigator</h2>

      <div className="h-64 overflow-y-auto border rounded p-3 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.sender === "user" ? "text-blue-600" : "text-gray-800"}`}>
            <strong>{m.sender === "user" ? "You" : "Investigator"}:</strong> {m.text}
          </div>
        ))}
      </div>

      <div className="flex space-x-3">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Ask about alerts, clusters, risk, fraud rings..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
