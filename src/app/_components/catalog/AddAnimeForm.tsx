"use client";

import { useState } from "react";

export default function AddAnimeForm() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/anime/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        year: Number(year),
        genre: genre.split(",").map((g) => g.trim()),
        description,
        image, // имя файла изображения
      }),
    });

    if (response.ok) {
      alert("Аниме добавлено!");
      location.reload();
    } else {
      alert("Ошибка при добавлении аниме");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <h2 className="text-xl font-semibold">Добавить аниме</h2>

      <input
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 rounded text-black"
        required
      />

      <input
        type="text"
        placeholder="Имя файла изображения (например, naruto.jpg)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="w-full p-2 rounded text-black"
      />

      <input
        type="number"
        placeholder="Год"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="w-full p-2 rounded text-black"
        required
      />

      <input
        type="text"
        placeholder="Жанры (через запятую)"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="w-full p-2 rounded text-black"
        required
      />

      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 rounded text-black"
        rows={4}
      />

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Добавить
      </button>
    </form>
  );
}
