"use client";
import React from "react";

interface Player {
  name: string;
  position: string;
  skillLevel: string;
}

interface PlayerRowProps {
  index: number;
  player: Player;
  onPlayerChange: (index: number, field: keyof Player, value: string) => void;
}

const PlayerRow: React.FC<PlayerRowProps> = ({
  index,
  player,
  onPlayerChange,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 items-center border-b py-2">
      <input
        type="text"
        value={player.name}
        onChange={(e) => onPlayerChange(index, "name", e.target.value)}
        placeholder="Imię"
        className="px-2 py-1 border rounded-md"
      />
      <input
        type="text"
        value={player.position}
        onChange={(e) => onPlayerChange(index, "position", e.target.value)}
        placeholder="Pozycja"
        className="px-2 py-1 border rounded-md"
      />
      <input
        type="text"
        value={player.skillLevel}
        onChange={(e) => onPlayerChange(index, "skillLevel", e.target.value)}
        placeholder="Poziom umiejętności"
        className="px-2 py-1 border rounded-md"
      />
    </div>
  );
};

export default PlayerRow;
