"use client";

import React, { useState, useEffect } from "react";
import PlayerTable from "./PlayerTable";
import Navbar from "@/components/Navbar";

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

  // Fetch team and players when component mounts
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch("/api/team/get");
        if (response.ok) {
          const data = await response.json();
          setPlayers(data.players);
        } else {
          setTeamExists(false); // No team found
        }
      } catch (error) {
        console.error("Error fetching team:", error);
        setTeamExists(false);
      }
    };

    fetchTeam();
  }, []);

  // Function to handle player updates
  const handleUpdatePlayer = async (updatedPlayer: Player) => {
    try {
      const response = await fetch(`/api/team/updatePlayer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPlayer),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setPlayers((prev) =>
          prev.map((player) =>
            player.id === updatedData.id ? updatedData : player
          )
        );
        setEditingPlayer(null);
      } else {
        const errorData = await response.json();
        console.error("Error updating player:", errorData.error);
      }
    } catch (error) {
      console.error("Error updating player:", error);
    }
  };

  if (!teamExists) {
    return (
      <>
        <Navbar />
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
      </>
    );
  }

  if (editingPlayer) {
    return (
      <>
        <Navbar />

        <div className="p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Edytuj Zawodnika</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdatePlayer(editingPlayer);
            }}
          >
            {/* Pole Imię */}
            <div className="mb-4">
              <label className="block font-medium mb-2">Imię:</label>
              <input
                type="text"
                value={editingPlayer.name}
                onChange={(e) =>
                  setEditingPlayer({ ...editingPlayer, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Pole Pozycja */}
            <div className="mb-4">
              <label className="block font-medium mb-2">Pozycja:</label>
              <select
                value={editingPlayer.position}
                onChange={(e) =>
                  setEditingPlayer({
                    ...editingPlayer,
                    position: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Wybierz pozycję</option>
                <option value="bramkarz">Bramkarz</option>
                <option value="obrońca">Obrońca</option>
                <option value="pomocnik">Pomocnik</option>
                <option value="napastnik">Napastnik</option>
              </select>
            </div>

            {/* Pole Poziom Gracza */}
            <div className="mb-4">
              <label className="block font-medium mb-2">Poziom Gracza:</label>
              <select
                value={editingPlayer.skillLevel}
                onChange={(e) =>
                  setEditingPlayer({
                    ...editingPlayer,
                    skillLevel: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Wybierz poziom</option>
                <option value="amator">Amator</option>
                <option value="pół-zawodowiec">Pół-zawodowiec</option>
                <option value="zawodowiec">Zawodowiec</option>
              </select>
            </div>

            {/* Przyciski */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Zapisz
              </button>
              <button
                type="button"
                onClick={() => setEditingPlayer(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Zarządzaj Drużyną
        </h1>
        <PlayerTable players={players} onEditPlayer={setEditingPlayer} />
      </div>
    </>
  );
}
