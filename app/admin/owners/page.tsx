"use client";

import { useState, useEffect } from "react";

export default function OwnersPage() {
  const [owners, setOwners] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/owners", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOwners(await res.json());
    }
    load();
  }, []);

  async function handleCreate(e: any) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("/api/owners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });

    const owner = await res.json();
    setOwners((prev) => [...prev, owner]);
    setName("");
    setEmail("");
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Owner Onboarding</h1>

      <form onSubmit={handleCreate} className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Owner name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Owner email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-black text-white px-4 py-2 rounded">
          Create Owner
        </button>
      </form>

      <ul className="space-y-2">
        {owners.map((o) => (
          <li key={o.id} className="border p-2 rounded">
            <div className="font-semibold">{o.name}</div>
            <div className="text-sm text-gray-600">{o.email}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
