"use client";
import React, { useState } from "react";
import PlayerRow from "./PlayerRow";

interface Player {
  name: string;
  position: string;
  skillLevel: string;
}

interface TeamFormProps {
  onTeamCreated: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ onTeamCreated }) => {
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState<Player[]>(
    Array(6).fill({ name: "", position: "", skillLevel: "" })
  );

  const handlePlayerChange = (
    index: number,
    field: keyof Player,
    value: string
  ) => {
    const updatedPlayers = [...players];
    updatedPlayers[index][field] = value;
    setPlayers(updatedPlayers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/team/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: teamName, players }),
    });

    if (response.ok) {
      onTeamCreated();
    } else {
      alert("Wystąpił błąd podczas tworzenia drużyny.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nazwa Drużyny */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          🏆 Nazwa Drużyny
        </label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Wprowadź nazwę drużyny"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Zawodnicy */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">👥 Zawodnicy</h3>
        {players.map((player, index) => (
          <PlayerRow
            key={index}
            index={index}
            player={player}
            onPlayerChange={handlePlayerChange}
          />
        ))}
      </div>

      {/* Przycisk Submit */}
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
      >
        ➕ Stwórz Drużynę
      </button>
    </form>
  );
};

export default TeamForm;
