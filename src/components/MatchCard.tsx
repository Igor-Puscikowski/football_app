import React from "react";

interface MatchCardProps {
  title: string;
  location: string;
  dateTime: string;
  description: string;
  teamName: string;
  status: "confirmed" | "join" | "pending";
}

const MatchCard: React.FC<MatchCardProps> = ({
  title,
  location,
  dateTime,
  description,
  teamName,
  status,
}) => {
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
        {status === "confirmed" ? (
          <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs">
            Potwierdzony
          </span>
        ) : (
          <span className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs">
            Oczekiwanie na potwierdzenie
          </span>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
