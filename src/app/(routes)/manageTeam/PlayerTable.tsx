"use client";
import React from "react";

interface Player {
  id: string;
  name: string;
  position: string;
  skillLevel: string;
}

interface Props {
  players: Player[];
  onEditPlayer: (player: Player) => void;
}

const PlayerTable: React.FC<Props> = ({ players, onEditPlayer }) => {
  return (
    <div className="max-w-4xl mx-auto mt-8 overflow-hidden border border-gray-300 rounded-lg shadow-md">
      <table className="w-full text-base text-left text-gray-500">
        <thead className="text-lg text-gray-700 uppercase bg-gray-100 text-center">
          <tr>
            <th className="px-4 py-3">Zawodnik</th>
            <th className="px-4 py-3">Pozycja</th>
            <th className="px-4 py-3">Poziom gracza</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id} className="hover:bg-gray-50 text-center">
              <td className="px-4 py-3">{player.name}</td>
              <td className="px-4 py-3">{player.position}</td>
              <td className="px-4 py-3">{player.skillLevel}</td>
              <td className="px-4 py-3 flex justify-center">
                <button
                  onClick={() => onEditPlayer(player)}
                  className="text-blue-500 hover:underline flex items-center"
                >
                  ✏️ Edytuj
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;
