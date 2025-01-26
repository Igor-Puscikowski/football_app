"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import MatchCard from "@/components/MatchCard";
import Navbar from "@/components/Navbar";

interface Match {
  id: string;
  title: string;
  location: string;
  dateTime: string;
  description: string;
  teamName: string;
  teamId: string;
  status: "pending" | "confirmed" | "join"; // Dodano "join" jako możliwy status
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [applications, setApplications] = useState<
    { matchId: string; status: "pending" | "confirmed" }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserTeamId, setCurrentUserTeamId] = useState<string | null>(
    null
  );

  // Pobierz ID drużyny zalogowanego użytkownika
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/user/current");
        if (!response.ok) {
          throw new Error("Nie udało się pobrać danych użytkownika.");
        }
        const userData = await response.json();
        setCurrentUserTeamId(userData.teamId); // Zakładamy, że `teamId` jest częścią odpowiedzi
      } catch (err) {
        console.error("Błąd podczas pobierania danych użytkownika:", err);
        setCurrentUserTeamId(null);
      }
    };

    fetchCurrentUser();
  }, []);

  // Pobierz zgłoszenia drużyny
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/user/applications");
        if (!response.ok) {
          throw new Error("Nie udało się pobrać zgłoszeń.");
        }
        const data = await response.json();
        setApplications(data);
      } catch (err) {
        console.error("Błąd podczas pobierania zgłoszeń:", err);
      }
    };

    if (currentUserTeamId) {
      fetchApplications();
    }
  }, [currentUserTeamId]);

  // Pobierz mecze z API
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("/api/match/getAll");
        if (!response.ok) {
          throw new Error("Nie udało się pobrać danych meczów.");
        }
        const data = await response.json();

        // Aktualizacja statusu meczu na podstawie zgłoszeń
        const updatedMatches = data.map((match: Match) => {
          const application = applications.find(
            (app) => app.matchId === match.id
          );

          return {
            ...match,
            status: application?.status || "join", // Ustawienie statusu na podstawie zgłoszenia
          };
        });

        setMatches(updatedMatches);
        setFilteredMatches(updatedMatches); // Ustawienie początkowej listy meczów
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Nieznany błąd";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [applications]); // Odśwież mecze, gdy aplikacje zostaną załadowane

  // Obsługa wyszukiwania
  const handleSearch = (query: string) => {
    const normalizedQuery = query.toLowerCase();
    const filtered = matches.filter((match) =>
      match.location.toLowerCase().includes(normalizedQuery)
    );
    setFilteredMatches(filtered); // Aktualizacja filtrowanej listy
  };

  // Obsługa aktualizacji statusu meczu
  const handleStatusUpdate = (
    matchId: string,
    newStatus: "pending" | "confirmed" | "join"
  ) => {
    setMatches((prevMatches) =>
      prevMatches.map((match) =>
        match.id === matchId ? { ...match, status: newStatus } : match
      )
    );
    setFilteredMatches((prevMatches) =>
      prevMatches.map((match) =>
        match.id === matchId ? { ...match, status: newStatus } : match
      )
    );
  };

  if (loading) {
    return <p className="text-center mt-10">Ładowanie meczów...</p>;
  }

  if (error) {
    return (
      <>
        <Navbar />
        <p className="text-center mt-10 text-red-500">{error}</p>;
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center">
        <div className="relative w-[80%] max-w-[1200px] h-[300px] md:h-[400px] overflow-hidden mt-6 rounded-lg shadow-lg">
          <Image
            src="/footballpitch.jpg"
            alt="Boisko piłkarskie"
            layout="fill"
            objectFit="cover"
            quality={90}
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-6 md:mt-10">
              Aktualne wydarzenia
            </h1>
            <div className="w-full max-w-md px-4 mt-auto mb-4 md:mb-8">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 w-[80%]">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              title={match.title}
              location={match.location}
              dateTime={match.dateTime}
              description={match.description}
              teamName={match.teamName}
              teamId={match.teamId}
              status={match.status}
              matchId={match.id}
              isOwner={match.teamId === currentUserTeamId} // Logika sprawdzania właściciela meczu
              onStatusUpdate={handleStatusUpdate} // Przekazywanie funkcji aktualizacji statusu
            />
          ))}
        </div>
      </div>
    </>
  );
}
