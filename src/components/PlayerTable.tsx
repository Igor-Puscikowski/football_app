import React from "react";

interface Player {
  id: string;
  name: string;
  position: string;
  skillLevel: string;
}

interface Props {
  players: Player[];
  onDeletePlayer: (id: string) => void;
  onEditPlayer: (player: Player) => void;
}

const PlayerTable: React.FC<Props> = ({
  players,
  onDeletePlayer,
  onEditPlayer,
}) => {
  return (
    <table className="w-full mt-4 border-collapse border">
      <thead>
        <tr>
          <th className="border p-2">Imię</th>
          <th className="border p-2">Pozycja</th>
          <th className="border p-2">Poziom umiejętności</th>
          <th className="border p-2">Akcje</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player) => (
          <tr key={player.id}>
            <td className="border p-2">{player.name}</td>
            <td className="border p-2">{player.position}</td>
            <td className="border p-2">{player.skillLevel}</td>
            <td className="border p-2">
              <button
                onClick={() => onEditPlayer(player)}
                className="mr-2 text-blue-500"
              >
                Edytuj
              </button>
              <button
                onClick={() => onDeletePlayer(player.id)}
                className="text-red-500"
              >
                Usuń
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlayerTable;
