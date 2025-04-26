"use client";

import { useState } from "react";

interface Anime {
  id: string;
  title: string;
  year: number | null;
  description?: string | null;
  genre: string[];
  image?: string | null;
}

interface AnimeEditFormProps {
  anime: Anime;
}

export function AnimeEditForm({ anime }: AnimeEditFormProps) {
  const [title, setTitle] = useState(anime.title);
  const [year, setYear] = useState(anime.year ?? 0);
  const [description, setDescription] = useState(anime.description ?? "");
  const [genre, setGenre] = useState(anime.genre.join(", "));
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", anime.id);
    formData.append("title", title);
    formData.append("year", year.toString());
    formData.append("description", description);
    formData.append("genre", genre);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch("/api/anime/update", {
      method: "POST",
      body: formData, // не указываем Content-Type вручную!
    });

    if (res.ok) {
      alert("Аниме обновлено");
      location.reload();
    } else {
      const data = await res.json();
      alert(data.message || "Ошибка при обновлении");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6" encType="multipart/form-data">
      <div>
        <label>Название:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-1 rounded w-full"
          required
        />
      </div>
      <div>
        <label>Год:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border p-1 rounded w-full"
          required
        />
      </div>
      <div>
        <label>Жанры (через запятую):</label>
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border p-1 rounded w-full"
        />
      </div>
      <div>
        <label>Описание:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-1 rounded w-full"
        />
      </div>
      <div>
        <label>Новая картинка:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="block mt-1"
        />
      </div>
      <button
        type="submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Сохранить изменения
      </button>
    </form>
  );
}
