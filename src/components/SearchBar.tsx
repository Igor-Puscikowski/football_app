import React from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value); // Wywołanie funkcji filtrowania na każdą zmianę
  };

  return (
    <div className="flex w-full shadow-md rounded-md overflow-hidden">
      <input
        type="text"
        placeholder="Szukaj po lokalizacji..."
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="px-4 bg-blue-500 text-white rounded-r-md flex items-center justify-center">
        🔍
      </span>
    </div>
  );
};

export default SearchBar;
