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
    <div className="overflow-hidden border border-gray-300 rounded-lg shadow-md">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="px-4 py-2">Zawodnik</th>
            <th className="px-4 py-2">Pozycja</th>
            <th className="px-4 py-2">Poziom gracza</th>
            <th className="px-4 py-2 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{player.name}</td>
              <td className="px-4 py-2">{player.position}</td>
              <td className="px-4 py-2">{player.skillLevel}</td>
              <td className="px-4 py-2 flex justify-end space-x-2">
                <button
                  onClick={() => onEditPlayer(player)}
                  className="text-blue-500 hover:underline"
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
