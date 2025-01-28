"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [nickname, setNickname] = useState(""); // Nick użytkownika
  const [teamName, setTeamName] = useState(""); // Nazwa drużyny
  const [activeMatches, setActiveMatches] = useState(0); // Liczba aktywnych meczów
  const [isEditingTeamName, setIsEditingTeamName] = useState(false); // Tryb edycji nazwy drużyny
  const [error, setError] = useState<string | null>(null); // Obsługa błędów
  const router = useRouter();

  useEffect(() => {
    // Pobierz dane użytkownika (nick, nazwa drużyny, liczba aktywnych meczów)
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (!response.ok) {
          throw new Error("Nie udało się pobrać danych profilu.");
        }
        const data = await response.json();
        setNickname(data.nickname || "Nieznany użytkownik");
        setTeamName(data.teamName || "Brak drużyny");
        setActiveMatches(data.activeMatches || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nieznany błąd");
      }
    };

    fetchProfileData();
  }, []);

  const handleSaveTeamName = async () => {
    try {
      const response = await fetch("/api/team/updateName", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamName }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się zaktualizować nazwy drużyny.");
      }
      alert("Nazwa drużyny została zaktualizowana!");
      setIsEditingTeamName(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Nieznany błąd");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      router.push("/login");
    } catch (error) {
      alert("Nie udało się wylogować. Spróbuj ponownie.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Profil użytkownika
        </h1>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {/* Informacje o użytkowniku */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Informacje o użytkowniku
          </h2>
          <p>
            <strong>Nazwa użytkownika:</strong> {nickname}
          </p>
        </div>

        {/* Informacje o drużynie */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Twoja drużyna</h2>
          <div className="flex items-center space-x-4">
            {isEditingTeamName ? (
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <p>
                <strong>Nazwa drużyny:</strong> {teamName}
              </p>
            )}
            <button
              onClick={() =>
                isEditingTeamName
                  ? handleSaveTeamName()
                  : setIsEditingTeamName(true)
              }
              className={`px-4 py-2 text-white rounded-md ${
                isEditingTeamName
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isEditingTeamName ? "Zapisz" : "Edytuj"}
            </button>
            {isEditingTeamName && (
              <button
                onClick={() => setIsEditingTeamName(false)}
                className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
              >
                Anuluj
              </button>
            )}
          </div>
        </div>

        {/* Informacje o meczach */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Twoje mecze</h2>
          <p>
            <strong>Liczba aktywnych meczów:</strong> {activeMatches}
          </p>
        </div>

        {/* Przycisk wylogowania */}
        <div className="text-center mt-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
          >
            Wyloguj się
          </button>
        </div>
      </div>
    </>
  );
}
