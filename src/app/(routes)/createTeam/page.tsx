"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState([
    { name: "", position: "", skillLevel: "" },
  ]);
  const [error, setError] = useState("");
  const router = useRouter();

  const handlePlayerChange = (index: number, field: string, value: string) => {
    const newPlayers = [...players];
    newPlayers[index][field as keyof (typeof newPlayers)[0]] = value;
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    if (players.length < 6) {
      setPlayers([...players, { name: "", position: "", skillLevel: "" }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/team/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: teamName, players }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create team");
        return;
      }

      router.push("/matches");
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Create Team</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full border p-2 mb-2"
        />

        {players.map((player, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              placeholder="Player Name"
              value={player.name}
              onChange={(e) =>
                handlePlayerChange(index, "name", e.target.value)
              }
              className="w-full border p-2 mb-1"
            />
            <input
              type="text"
              placeholder="Position"
              value={player.position}
              onChange={(e) =>
                handlePlayerChange(index, "position", e.target.value)
              }
              className="w-full border p-2 mb-1"
            />
            <input
              type="text"
              placeholder="Skill Level"
              value={player.skillLevel}
              onChange={(e) =>
                handlePlayerChange(index, "skillLevel", e.target.value)
              }
              className="w-full border p-2 mb-1"
            />
          </div>
        ))}

        {players.length < 6 && (
          <button
            type="button"
            onClick={addPlayer}
            className="mb-2 text-blue-500"
          >
            + Add Player
          </button>
        )}

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Team
        </button>
      </form>
    </div>
  );
}
