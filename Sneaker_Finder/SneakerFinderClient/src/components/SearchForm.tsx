import React, { useState } from "react";
import Button from "./Button";

export default function SearchForm() {
  const [searchTerm, setSearchTerm] = useState("");

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row m-10">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          className="p-2 rounded-lg flex-grow sm:mr-5 w-full sm:w-96 opacity-70 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 focus:opacity-85 placeholder-slate-800 mb-4 sm:mb-0"
          placeholder="Wyszukaj markę, model..."
        />

        <Button
          name="Szukaj"
          className="w-full sm:w-32 rounded-lg border-2 border-slate-400"
        />
      </form>
    </>
  );
}
