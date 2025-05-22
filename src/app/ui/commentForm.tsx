"use client";

import { useState } from "react";
interface User {
  id: string;
  name?: string | null;
  image?: string | null;
}

export interface AnimeComment {
  id: string;
  text: string;
  createdAt: Date;
  user: User;
  voteCount: number;
  userVote?: number;
}

interface CommentFormProps {
  animeId: string;
  onAddComment: (comment: AnimeComment) => void;
  parentId?: string | null;
}

export function CommentForm({ animeId, onAddComment, parentId = null }: CommentFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await fetch("/api/comments/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animeId, text, parentId }),
      });

      if (!res.ok) throw new Error("Ошибка при добавлении комментария");

      const rawComment = await res.json();

      const newComment: AnimeComment = {
        ...rawComment,
        createdAt: new Date(rawComment.createdAt),
        user: rawComment.user,
        voteCount: 0,
      };

      onAddComment(newComment);
      setText("");
    } catch (err) {
      console.error(err);
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
