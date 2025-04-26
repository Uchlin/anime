// app/ui/DeleteAnimeButton.tsx
"use client";

interface DeleteAnimeButtonProps {
  animeId: string;
}

export default function DeleteAnimeButton({ animeId }: DeleteAnimeButtonProps) {
  async function handleDelete() {
    if (!confirm("Удалить это аниме?")) return;

    const res = await fetch("../../api/anime/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: animeId }),
    });

    if (res.ok) {
      alert("Аниме удалено");
      window.location.href = "/";
    } else {
      alert("Ошибка при удалении");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Удалить аниме
    </button>
  );
}
