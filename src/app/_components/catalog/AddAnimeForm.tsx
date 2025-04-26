"use client";

import { useState } from "react";

export default function AddAnimeForm() {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("year", year);
    formData.append("genre", genre);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch("/api/anime/add", {
      method: "POST",
      body: formData, // отправляем FormData, Content-Type будет выставлен автоматически
    });

    if (response.ok) {
      alert("Аниме добавлено!");
      location.reload();
    } else {
      alert("Ошибка при добавлении аниме");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4" encType="multipart/form-data">
      <h2 className="text-xl font-semibold">Добавить аниме</h2>
        <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="w-full p-2 rounded text-white-600"
      />
      <input
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 rounded text-white-600"
        required
      />

      <input
        type="number"
        placeholder="Год"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="w-full p-2 text-white-600"
        required
      />

      <input
        type="text"
        placeholder="Жанры (через запятую)"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="w-full p-2 rounded text-white-600"
        required
      />

      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 rounded text-white-600"
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
