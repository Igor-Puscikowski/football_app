"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

interface Match {
  id: string;
  title: string;
  location: string;
  dateTime: string;
  description: string;
  status: string;
  teamName: string;
}

export default function ManageMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/match/mine");
        if (!response.ok) {
          throw new Error("Nie udało się pobrać meczów.");
        }
        const data = await response.json();
        setMatches(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nieznany błąd");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleDelete = async (matchId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten mecz?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/match/${matchId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Nie udało się usunąć meczu.");
      }

      setMatches((prevMatches) =>
        prevMatches.filter((match) => match.id !== matchId)
      );
      alert("Mecz został usunięty.");
    } catch (err) {
      console.error(err);
      alert("Błąd podczas usuwania meczu.");
    }
  };

  const handleEdit = (match: Match) => {
    // Przekierowanie lub otwarcie formularza edycji
    window.location.href = `/edit-match/${match.id}`;
  };

  if (loading) {
    return <p className="text-center mt-10">Ładowanie meczów...</p>;
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <p className="text-center mt-10 text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-6">Zarządzanie moimi meczami</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <div key={match.id} className="p-4 bg-white shadow-md rounded-lg">
              <h2 className="text-xl font-bold mb-2">{match.title}</h2>
              <p className="text-gray-700 text-sm mb-1">
                <strong>Lokalizacja:</strong> {match.location}
              </p>
              <p className="text-gray-700 text-sm mb-1">
                <strong>Data i godzina:</strong>{" "}
                {new Date(match.dateTime).toLocaleString()}
              </p>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Opis:</strong> {match.description}
              </p>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Status:</strong> {match.status}
              </p>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Drużyna:</strong> {match.teamName}
              </p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleEdit(match)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => handleDelete(match.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
