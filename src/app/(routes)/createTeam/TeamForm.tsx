"use client";
import React, { useState } from "react";

interface TeamFormProps {
  onTeamCreated: (team: { id: string; name: string }) => void;
}

export default function TeamForm({ onTeamCreated }: TeamFormProps) {
  const [teamName, setTeamName] = useState("");

  const handleCreateTeam = async () => {
    const res = await fetch("/api/team/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "USER_ID", teamName }),
    });

    const data = await res.json();

    if (res.ok) {
      onTeamCreated(data);
    } else {
      alert(data.error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Stwórz Drużynę</h2>
      <input
        type="text"
        placeholder="Nazwa drużyny"
        className="border p-2"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <button
        onClick={handleCreateTeam}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
      >
        Stwórz Drużynę
      </button>
    </div>
  );
}
