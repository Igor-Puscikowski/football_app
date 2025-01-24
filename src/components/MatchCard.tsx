"use client";
import React, { useState } from "react";

interface MatchCardProps {
  title: string;
  location: string;
  dateTime: string;
  description: string;
  teamName: string;
  teamId: string;
  status: "pending" | "confirmed";
}

const MatchCard: React.FC<MatchCardProps> = ({
  title,
  location,
  dateTime,
  description,
  teamName,
  teamId,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [teamDetails, setTeamDetails] = useState<any>(null);

  const handleInfoClick = async () => {
    console.log("Fetching team info for ID:", teamId); // Debuguj teamId

    if (!teamId) {
      alert("Brak ID drużyny.");
      return;
    }

    try {
      const response = await fetch(`/api/team/${teamId}`);
      if (!response.ok) {
        throw new Error("Nie udało się pobrać szczegółów drużyny.");
      }
      const data = await response.json();
      setTeamDetails(data);
      setShowModal(true);
    } catch (error) {
      console.error("Błąd podczas pobierania szczegółów drużyny:", error);
      alert("Nie udało się pobrać szczegółów drużyny.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700 text-sm mb-1">
        <strong>Lokalizacja:</strong> {location}
      </p>
      <p className="text-gray-700 text-sm mb-1">
        <strong>Data i godzina:</strong> {new Date(dateTime).toLocaleString()}
      </p>
      <p className="text-gray-700 text-sm mb-2">
        <strong>Opis:</strong> {description}
      </p>
      <p className="text-gray-700 text-sm mb-2">
        <strong>Drużyna:</strong> {teamName}
      </p>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleInfoClick}
          className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs"
        >
          Info
        </button>
      </div>

      {showModal && teamDetails && (
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
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchCard;
