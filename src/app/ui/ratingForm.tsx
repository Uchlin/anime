"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { rateAnime, deleteRating } from "../api/action/rateAnime";

interface RatingFormProps {
  animeId: string;
  initialRating?: number;
}

export function RatingForm({ animeId, initialRating }: RatingFormProps) {
  const [rating, setRating] = useState(initialRating || 0);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleClick = async (value: number) => {
    setRating(value);
    await rateAnime(animeId, value);
    setSubmitted(true);
    router.refresh();
  };

  const handleDelete = async () => {
    await deleteRating(animeId);
    setRating(0);
    setSubmitted(false);
    router.refresh();
  };

  const hasRating = rating > 0 || initialRating !== undefined;

  return (
    <div>
      <div className="flex space-x-5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleClick(star)}
            className={`text-5xl transition-colors ${
              star <= rating ? "text-yellow-400" : "text-white"
            }`}
          >
            ★
          </button>
        ))}
        {hasRating && (
        <button
          onClick={handleDelete}
          className="text-sm text-red-400 underline hover:text-red-600"
        >
          Удалить оценку
        </button>
      )}
      </div>
    </div>
  );
}
