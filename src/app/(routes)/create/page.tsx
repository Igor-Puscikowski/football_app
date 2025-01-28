"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function CreateMatchPage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !location || !dateTime) {
      setError("Wszystkie pola są wymagane!");
      return;
    }

    try {
      const response = await fetch("/api/match/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchTitle: title,
          matchLocation: location,
          matchDateTime: dateTime,
          matchDescription: description,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Mecz utworzony:", data);
        router.push("/matches"); // Przekierowanie do listy meczów
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Wystąpił błąd.");
      }
    } catch (error) {
      console.error("Błąd tworzenia meczu:", error);
      setError("Wystąpił błąd serwera.");
    }
  };

  return (
    <>
      <Navbar />
      {/* Kontener z tłem */}
      <div
        className=" min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('mountv2.jpg')" }}
      >
        <div className="max-w-lg mx-auto pt-36 pb-12 px-6">
          <div className="bg-white rounded-lg shadow-md p-6">
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
                Stwórz Mecz
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
