"use client";

import React, { useState } from "react";

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
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(anime.image ? `/images/${anime.image}` : "");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(anime.image ? `/images/${anime.image}` : "");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", anime.id);
    formData.append("title", title);
    formData.append("year", String(year));
    formData.append("description", description);
    formData.append("genre", genre);
    if (file) {
      formData.append("image", file);
    }

    const res = await fetch("/api/anime/update", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Данные обновлены");
      location.reload();
    } else {
      const data = await res.json();
      alert(data.message || "Ошибка при обновлении");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div>
        <label className="block mb-1 font-semibold">Название:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Год:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Жанры (через запятую):</label>
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Описание:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-full"
          rows={4}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Изображение:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <img
            src={preview}
            alt="Превью изображения"
            className="mt-2 max-w-xs rounded border"
          />
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Сохранить изменения
      </button>
    </form>
  );
}
