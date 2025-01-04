"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import MatchCard from "@/components/MatchCard";
import { mockMatches } from "@/data/matchData";

interface Match {
  id: string;
  title: string;
  location: string;
  dateTime: string;
  description: string;
  teamName: string;
  status: "pending" | "confirmed";
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);

  // Pobierz dane z localStorage i połącz z mockMatches
  useEffect(() => {
    const storedMatches = JSON.parse(localStorage.getItem("matches") || "[]");
    const combinedMatches = [...mockMatches, ...storedMatches]; // Łączymy mockMatches i dane z localStorage
    setMatches(combinedMatches);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Sekcja z obrazem i SearchBar */}
      <div className="relative w-[80%] max-w-[1200px] h-[300px] md:h-[400px] overflow-hidden mt-6 rounded-lg shadow-lg">
        <Image
          src="/footballpitch.jpg"
          alt="Boisko piłkarskie"
          layout="fill"
          objectFit="cover"
          quality={90}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center">
          {/* Tytuł */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-6 md:mt-10">
            Aktualne wydarzenia
          </h1>
          {/* SearchBar */}
          <div className="w-full max-w-md px-4 mt-auto mb-4 md:mb-8">
            <SearchBar onSearch={() => {}} />
          </div>
        </div>
      </div>

      {/* Sekcja z kartami meczów */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 w-[80%]">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            title={match.title}
            location={match.location}
            dateTime={match.dateTime}
            description={match.description}
            teamName={match.teamName}
            status={match.status}
          />
        ))}
      </div>
    </div>
  );
}
