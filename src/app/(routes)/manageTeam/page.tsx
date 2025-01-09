"use client";
import React, { useState, useEffect } from "react";
import PlayerTable from "./PlayerTable";

interface Player {
  id: string;
  name: string;
  position: string;
  skillLevel: string;
}

export default function ManageTeamPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teamExists, setTeamExists] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch("/api/team/get");
        if (response.ok) {
          const data = await response.json();
          setPlayers(data.players);
        } else {
          setTeamExists(false); // Jeśli brak drużyny
        }
      } catch (error) {
        console.error("Błąd podczas pobierania drużyny:", error);
        setTeamExists(false);
      }
    };

    fetchTeam();
  }, []);

  const handleUpdatePlayer = async (updatedPlayer: Player) => {
    try {
      const response = await fetch(`/api/team/updatePlayer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPlayer),
      });

      if (response.ok) {
        setPlayers((prev) =>
          prev.map((player) =>
            player.id === updatedPlayer.id ? updatedPlayer : player
          )
        );
        setEditingPlayer(null);
      }
    } catch (error) {
      console.error("Błąd podczas aktualizacji gracza:", error);
    }
  };

  const handleDeletePlayer = async (id: string) => {
    try {
      const response = await fetch(`/api/team/deletePlayer`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setPlayers((prev) => prev.filter((player) => player.id !== id));
      }
    } catch (error) {
      console.error("Błąd podczas usuwania gracza:", error);
    }
  };

  if (!teamExists) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-2xl font-semibold mb-4">
          Nie masz jeszcze drużyny!
        </h1>
        <button
          onClick={() => (window.location.href = "/createTeam")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          ➕ Stwórz Drużynę
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Zarządzaj Drużyną</h1>
      <PlayerTable
        players={players}
        onEditPlayer={setEditingPlayer}
        onDeletePlayer={handleDeletePlayer}
      />
    </div>
  );
}
