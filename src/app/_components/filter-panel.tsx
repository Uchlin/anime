"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type FilterPanelProps = {
  basePath: string; // например: "/catalog" или "/plan"
};

export function FilterPanel({ basePath }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("");

  // При монтировании считываем значения из URL
  useEffect(() => {
    const genreParam = searchParams.get("genre") ?? "";
    const yearParam = searchParams.get("year") ?? "";
    const sortParam = searchParams.get("sort") ?? "year_desc";

    setGenre(genreParam);
    setYear(yearParam);
    setSort(sortParam);
  }, [searchParams]);

  function handleApply() {
    const params = new URLSearchParams();
    if (genre) params.set("genre", genre);
    if (year) params.set("year", year);
    if (sort) params.set("sort", sort);
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4 items-center pb-2">
      <select
        className="border rounded-lg p-2"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      >
        <option value="">Все жанры</option>
        <option value="сверхъестественное">Сверхъестественное</option>
        <option value="повседневность">Повседневность</option>
        <option value="исторический">Исторический</option>
        <option value="приключение">Приключение</option>
        <option value="фантастика">Фантастика</option>
        <option value="фэнтези">Фэнтези</option>
        <option value="комедия">Комедия</option>
        <option value="боевик">Боевик</option>
        <option value="драма">Драма</option>
        <option value="сёнэн">Сёнэн</option>
      </select>

      <input
        type="number"
        className="border rounded-lg p-2 w-32"
        placeholder="Все года"
        value={year}
        onChange={(e) => {
          const val = e.target.value;
          if (val.length <= 4) setYear(val);
        }}
        onKeyDown={(e) => {
          if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
            e.preventDefault();
          }
        }}
        min={2000}
        max={2100}
      />

      <select
        className="border rounded-lg p-2"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="year_desc"> год по убыванию</option>
        <option value="year_asc"> год по возрастанию</option>
        <option value="title_asc"> от А до Я</option>
        <option value="title_desc">от Я до А</option>
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
