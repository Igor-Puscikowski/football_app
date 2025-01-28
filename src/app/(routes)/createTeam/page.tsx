"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Navbar from "@/components/Navbar";

interface Player {
  id: string;
  name: string;
  position: string;
  skillLevel: string;
}

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState<Player[]>(
    Array(6)
      .fill(null)
      .map(() => ({
        id: uuidv4(),
        name: "",
        position: "",
        skillLevel: "",
      }))
  );
  const [errors, setErrors] = useState<{ teamName: string; players: string[] }>(
    { teamName: "", players: Array(6).fill("") }
  );
  const [hasTeam, setHasTeam] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Sprawdzenie, czy użytkownik ma drużynę
    const checkTeam = async () => {
      const response = await fetch("/api/team/get");
      if (response.ok) {
        const data = await response.json();
        setHasTeam(!!data.team); // Jeśli drużyna istnieje, ustawiamy `hasTeam` na true
      }
    };
    checkTeam();
  }, []);

  const handlePlayerChange = (
    index: number,
    field: keyof Player,
    value: string
  ) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
    setPlayers(updatedPlayers);

    // Usuwanie błędu, jeśli pole zostało poprawnie wypełnione
    const updatedErrors = { ...errors };
    if (field === "name" && value.trim()) {
      updatedErrors.players[index] = "";
    }
    if (field === "position" && value.trim()) {
      updatedErrors.players[index] = "";
    }
    if (field === "skillLevel" && value.trim()) {
      updatedErrors.players[index] = "";
    }
    setErrors(updatedErrors);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { teamName: "", players: Array(6).fill("") };

    // Walidacja nazwy drużyny
    if (!teamName.trim()) {
      newErrors.teamName = "Nazwa drużyny jest wymagana";
      isValid = false;
    }

    // Walidacja zawodników
    players.forEach((player, index) => {
      if (!player.name.trim() || !player.position || !player.skillLevel) {
        newErrors.players[index] =
          "Wszystkie pola zawodnika muszą być wypełnione";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Zatrzymaj dalsze działanie, jeśli walidacja się nie powiodła
    }

    const response = await fetch("/api/team/createTeam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName, players }),
    });

    if (response.ok) {
      alert("Drużyna została utworzona!");
      router.push("/manageTeam");
    } else {
      const error = await response.json();
      alert(error.error || "Wystąpił błąd");
    }
  };

  // Jeśli użytkownik ma drużynę, pokaż komunikat
  if (hasTeam) {
    return (
      <>
        <Navbar />

        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Masz już drużynę!</h1>
          <button
            onClick={() => router.push("/manageTeam")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Przejdź do zarządzania drużyną
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h1 className="text-2xl font-bold mb-4">Stwórz Drużynę</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-2">Nazwa drużyny:</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Wprowadź nazwę drużyny"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.teamName && (
              <p className="text-red-500 text-sm mt-1">{errors.teamName}</p>
            )}
          </div>

          <h2 className="text-xl font-semibold mb-2">Zawodnicy:</h2>
          <div className="grid grid-cols-1 gap-4">
            {players.map((player, index) => (
              <div key={player.id} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) =>
                    handlePlayerChange(index, "name", e.target.value)
                  }
                  placeholder="Imię"
                  className="p-2 border border-gray-300 rounded-md"
                />
                <select
                  value={player.position}
                  onChange={(e) =>
                    handlePlayerChange(index, "position", e.target.value)
                  }
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Wybierz pozycję</option>
                  <option value="bramkarz">Bramkarz</option>
                  <option value="obrońca">Obrońca</option>
                  <option value="pomocnik">Pomocnik</option>
                  <option value="napastnik">Napastnik</option>
                </select>
                <select
                  value={player.skillLevel}
                  onChange={(e) =>
                    handlePlayerChange(index, "skillLevel", e.target.value)
                  }
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Wybierz poziom</option>
                  <option value="amator">Amator</option>
                  <option value="pół-zawodowiec">Pół-zawodowiec</option>
                  <option value="zawodowiec">Zawodowiec</option>
                </select>
                {errors.players[index] && (
                  <p className="text-red-500 text-sm col-span-3 mt-1">
                    {errors.players[index]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Stwórz Drużynę
          </button>
        </form>
      </div>
    </>
  );
}
