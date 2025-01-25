"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

interface Application {
  id: string;
  status: "pending" | "confirmed" | "rejected";
  team: { id: string; name: string };
}

interface Match {
  id: string;
  title: string;
  dateTime: string;
  applications: Application[];
}

export default function ManageApplicationsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamDetails, setTeamDetails] = useState<any>(null);
  const [loadingTeamInfo, setLoadingTeamInfo] = useState(false); // Dodano dla przycisku "Info"

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/applications/pending"
        );
        if (!response.ok) {
          throw new Error("Nie udało się pobrać aplikacji.");
        }
        const data = await response.json();
        setMatches(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nieznany błąd");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleUpdateStatus = async (
    applicationId: string,
    newStatus: "confirmed" | "rejected"
  ) => {
    try {
      const endpoint =
        newStatus === "confirmed"
          ? "http://localhost:3000/api/applications/accept"
          : "http://localhost:3000/api/applications/reject";

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się zaktualizować statusu aplikacji.");
      }

      setMatches((prevMatches) =>
        prevMatches.map((match) => ({
          ...match,
          applications: match.applications.map((app) =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          ),
        }))
      );
    } catch (error) {
      console.error("Błąd podczas aktualizacji statusu aplikacji:", error);
    }
  };

  const handleFetchTeamDetails = async (teamId: string) => {
    if (!teamId) {
      console.error(
        "Brak ID drużyny przekazanego do funkcji handleFetchTeamDetails."
      );
      alert("Brak ID drużyny.");
      return;
    }
    console.log("Fetching team details for teamId:", teamId); // Logowanie

    setLoadingTeamInfo(true);
    try {
      const response = await fetch(`http://localhost:3000/api/team/${teamId}`);
      if (!response.ok) {
        throw new Error("Nie udało się pobrać szczegółów drużyny.");
      }
      const data = await response.json();
      setTeamDetails(data);
    } catch (error) {
      console.error("Błąd podczas pobierania szczegółów drużyny:", error);
      alert("Nie udało się pobrać szczegółów drużyny.");
    } finally {
      setLoadingTeamInfo(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Ładowanie aplikacji...</p>;
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
        <h1 className="text-2xl font-bold mb-6">Zarządzanie aplikacjami</h1>
        {matches.map((match) => (
          <div key={match.id} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{match.title}</h2>
            <p className="text-gray-700 mb-4">
              <strong>Data meczu:</strong>{" "}
              {new Date(match.dateTime).toLocaleString()}
            </p>
            <div className="grid grid-cols-1 gap-4">
              {match.applications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-white shadow-md rounded-lg flex justify-between items-center"
                >
                  <div>
                    <span className="text-gray-700">{app.team.name}</span>
                    <button
                      onClick={() => handleFetchTeamDetails(app.team.id)}
                      className={`ml-4 text-blue-500 underline text-sm ${
                        loadingTeamInfo ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={loadingTeamInfo}
                    >
                      {loadingTeamInfo ? "Ładowanie..." : "Info"}
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    {app.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(app.id, "confirmed")
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                          Akceptuj
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, "rejected")}
                          className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                          Odrzuć
                        </button>
                      </>
                    )}
                    {app.status === "confirmed" && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, "rejected")}
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                      >
                        Anuluj
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {teamDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">{teamDetails.name}</h2>
            <p className="text-gray-700 mb-4">
              <strong>Data założenia:</strong>{" "}
              {new Date(teamDetails.createdAt).toLocaleDateString()}
            </p>
            <h3 className="text-lg font-semibold mb-2">Zawodnicy:</h3>
            <ul>
              {teamDetails.players.map((player: any) => (
                <li key={player.id} className="text-gray-700 mb-1">
                  {player.name} - {player.position} ({player.skillLevel})
                </li>
              ))}
            </ul>
            <button
              onClick={() => setTeamDetails(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
