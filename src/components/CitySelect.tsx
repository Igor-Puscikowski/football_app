"use client";
import React, { useEffect, useState } from "react";

interface CitySelectProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

export default function CitySelect({
  selectedCity,
  setSelectedCity,
}: CitySelectProps) {
  const [cities, setCities] = useState<string[]>([
    "Warszawa",
    "Kraków",
    "Gdańsk",
    "Wrocław",
    "Poznań",
  ]);

  return (
    <select
      value={selectedCity}
      onChange={(e) => setSelectedCity(e.target.value)}
      className="w-full p-2 border rounded"
      required
    >
      <option value="">Wybierz miasto</option>
      {cities.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  );
}
