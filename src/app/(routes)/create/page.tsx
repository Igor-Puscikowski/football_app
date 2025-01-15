"use client";
import React, { useState } from "react";
import CitySelect from "@/components/CitySelect";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Match {
  id: string;
  title: string;
  location: string;
  dateTime: string;
  description: string;
  teamName: string;
  status: "pending" | "confirmed";
}

export default function CreateMatchPage() {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !city || !dateTime) {
      setError("Wszystkie pola są wymagane!");
      return;
    }

    const newMatch: Match = {
      id: Date.now().toString(),
      title,
      location: city,
      dateTime,
      description,
      teamName: "Team Z",
      status: "pending",
    };

    // Zapisz mecz w localStorage
    const existingMatches = JSON.parse(localStorage.getItem("matches") || "[]");
    localStorage.setItem(
      "matches",
      JSON.stringify([...existingMatches, newMatch])
    );

    router.push("/matches"); // Przekierowanie na stronę z meczami
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Stwórz Nowy Mecz</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Tytuł meczu</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Lokalizacja</label>
            <CitySelect selectedCity={city} setSelectedCity={setCity} />
          </div>
          <div>
            <label className="block text-gray-700">Data i godzina</label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Opis</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Stwórz Mecz
          </button>
        </form>
      </div>
    </>
  );
}
