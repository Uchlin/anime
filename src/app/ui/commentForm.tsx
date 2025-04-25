"use client";

import { useState } from "react";
import { addComment } from "../api/action/commentActions"; // Серверная функция addComment
import { useRouter } from "next/navigation";
interface User {
  id: string;
  name?: string | null;
  image?: string | null;
}

export interface AnimeComment {
  id: string;
  text: string;
  createdAt: Date; // или Date, если у тебя дата объект
  user: User;
}
interface CommentFormProps {
  animeId: string;
  onAddComment: (comment: AnimeComment) => void; // колбек на добавление комментария
}

export function CommentForm({ animeId, onAddComment }: CommentFormProps) {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
  
    try {
      const rawComment = await addComment(animeId, text);
      const newComment: AnimeComment = {
        ...rawComment,
        createdAt: new Date(rawComment.createdAt),
        user: rawComment.user,
      };
      
      onAddComment(newComment);
      setText("");
    } catch {
      alert("Ошибка при добавлении комментария");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Оставьте комментарий..."
        className="resize-none p-2 border border-gray-300 rounded-md min-h-[80px]"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition self-start"
      >
        Отправить
      </button>
    </form>
  );
}
