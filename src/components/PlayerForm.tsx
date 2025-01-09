import React, { useState, useEffect } from "react";
import { Player } from "@/types/player";

interface Props {
  onAddPlayer: (player: Player) => void | Promise<void>;
  onUpdatePlayer: (player: Player) => void | Promise<void>;
  editingPlayer: Player | null;
}

const PlayerForm: React.FC<Props> = ({
  onAddPlayer,
  onUpdatePlayer,
  editingPlayer,
}) => {
  const [player, setPlayer] = useState<Player>({
    id: undefined,
    name: "",
    position: "",
    skillLevel: "",
  });

  useEffect(() => {
    if (editingPlayer) setPlayer(editingPlayer);
  }, [editingPlayer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlayer) {
      onUpdatePlayer(player);
    } else {
      onAddPlayer(player);
    }
    setPlayer({
      id: undefined,
      name: "",
      position: "",
      skillLevel: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={player.name}
        onChange={(e) => setPlayer({ ...player, name: e.target.value })}
        placeholder="Imię"
        className="w-full p-2 border rounded-md"
      />
      <input
        value={player.position}
        onChange={(e) => setPlayer({ ...player, position: e.target.value })}
        placeholder="Pozycja"
        className="w-full p-2 border rounded-md"
      />
      <input
        value={player.skillLevel}
        onChange={(e) => setPlayer({ ...player, skillLevel: e.target.value })}
        placeholder="Poziom umiejętności"
        className="w-full p-2 border rounded-md"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md w-full"
      >
        {editingPlayer ? "Zaktualizuj" : "Dodaj"} Gracza
      </button>
    </form>
  );
};

export default PlayerForm;
