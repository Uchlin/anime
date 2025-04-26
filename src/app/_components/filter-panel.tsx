"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FilterPanel() {
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const router = useRouter();

  function handleApply() {
    const params = new URLSearchParams();
    if (genre) params.set("genre", genre);
    if (year) params.set("year", year);
    router.push("/catalog?" + params.toString());
  }

  return (
    <div className="flex flex-wrap gap-4 items-center border-b pb-4">
      <select
        className="border rounded-lg p-2"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      >
        <option value="">Все жанры</option>
        <option value="Action">Экшен</option>
        <option value="Drama">Драма</option>
        <option value="Fantasy">Фэнтези</option>
      </select>

      <select
        className="border rounded-lg p-2"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      >
        <option value="">Все года</option>
        {[...Array(16)].map((_, i) => {
          const y = 2025 - i;
          return (
            <option key={y} value={y.toString()}>
              {y}
            </option>
          );
        })}
      </select>

      <button
        onClick={handleApply}
        className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Применить
      </button>
    </div>
  );
}
