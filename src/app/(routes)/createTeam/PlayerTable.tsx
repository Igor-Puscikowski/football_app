"use client";
import React, { useState } from "react";

interface Player {
  id: string;
  name: string;
  position: string;
  skillLevel: string;
}

interface PlayerTableProps {
  teamId: string;
}

export default function PlayerTable({ teamId }: PlayerTableProps) {
  const [players, setPlayers] = useState<Player[]>([]);

  const handleAddPlayer = async () => {
    const name = prompt("Imię zawodnika:");
    const position = prompt("Pozycja:");
    const skillLevel = prompt("Poziom umiejętności:");

    if (!name || !position || !skillLevel) return;

    const res = await fetch("/api/team/addPlayer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId, name, position, skillLevel }),
    });

    if (res.ok) {
      const newPlayer = await res.json();
      setPlayers([...players, newPlayer]);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Zawodnicy</h2>
      <button
        onClick={handleAddPlayer}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Dodaj zawodnika
      </button>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} - {player.position} ({player.skillLevel})
          </li>
        ))}
      </ul>
    </div>
  );
}
