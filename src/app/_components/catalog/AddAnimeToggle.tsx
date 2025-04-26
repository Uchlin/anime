"use client";

import { useState } from "react";
import AddAnimeForm from "../../_components/catalog/AddAnimeForm";

export default function AddAnimeToggle() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mb-8">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Добавить аниме
        </button>
      )}

      {showForm && (
        <div>
          <button
            onClick={() => setShowForm(false)}
            className="mb-4 text-sm text-red-600 hover:underline"
          >
            Отмена
          </button>
          <AddAnimeForm />
        </div>
      )}
    </div>
  );
}
