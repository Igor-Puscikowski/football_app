"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function EditMatchPage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Stan ładowania
  const router = useRouter();
  const params = useParams(); // Pobranie ID meczu z URL

  // Pobranie danych meczu
  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/match/${params.id}`
        );
        if (!response.ok) {
          throw new Error("Nie udało się pobrać danych meczu.");
        }
        const match = await response.json();
        setTitle(match.title);
        setLocation(match.location);
        setDateTime(new Date(match.dateTime).toISOString().slice(0, 16)); // Ustaw format dla input datetime-local
        setDescription(match.description || "");
        setLoading(false);
      } catch (error) {
        console.error("Błąd podczas pobierania danych meczu:", error);
        setError("Nie udało się pobrać danych meczu.");
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !location || !dateTime) {
      setError("Wszystkie pola są wymagane!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/match/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            location,
            dateTime,
            description,
          }),
        }
      );

      if (response.ok) {
        alert("Mecz został zaktualizowany.");
        router.push("/manageMatches"); // Przekierowanie do strony zarządzania meczami
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Wystąpił błąd.");
      }
    } catch (error) {
      console.error("Błąd podczas aktualizacji meczu:", error);
      setError("Wystąpił błąd serwera.");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Ładowanie danych meczu...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto mt-36 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edytuj Mecz</h2>
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
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
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
            Zapisz zmiany
          </button>
        </form>
      </div>
    </>
  );
}
