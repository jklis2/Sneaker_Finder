import { useState, useEffect } from "react";
import searchIcon from "../assets/icons/search.svg";

interface SearchProductProps {
  onSearch: (term: string) => void;
}

export default function SearchProduct({ onSearch }: SearchProductProps) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Debounce the search to avoid too many updates
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for sneakers..."
          className="w-full px-4 py-3 pl-12 pr-10 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <img src={searchIcon} alt="Search" className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
