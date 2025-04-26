"use client";

import { useState } from "react";
import { AnimeEditForm } from "../../_components/catalog/AnimeEditForm";
interface Anime {
  id: string;
  title: string;
  year: number | null;
  description?: string | null;
  genre: string[];
  image?: string | null;
}

interface AnimeEditToggleProps {
  anime: Anime;
}

export default function AnimeEditToggle({ anime }: AnimeEditToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isOpen ? "Скрыть редактирование" : "Редактировать аниме"}
      </button>

      {isOpen && (
        <div className="mt-4">
          <AnimeEditForm anime={anime} />
        </div>
      )}
    </div>
  );
}
