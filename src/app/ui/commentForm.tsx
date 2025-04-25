"use client";

import { useState } from "react";
import { addComment, updateComment, deleteComment } from "../api/action/commentActions";
import { useRouter } from "next/navigation";

interface CommentFormProps {
  animeId: string;
  initialComment?: {
    id: string;
    text: string;
  };
}

export function CommentForm({ animeId, initialComment }: CommentFormProps) {
  const [text, setText] = useState(initialComment?.text || "");
  const [editing, setEditing] = useState(!!initialComment);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) return;

    if (initialComment) {
      await updateComment(initialComment.id, text);
    } else {
      await addComment(animeId, text);
      setText("");
    }

    router.refresh();
  };

  const handleDelete = async () => {
    if (initialComment) {
      await deleteComment(initialComment.id);
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Оставьте комментарий..."
        className="w-full p-2 border rounded-md"
        rows={3}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
        >
          {initialComment ? "Сохранить" : "Отправить"}
        </button>
        {initialComment && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
          >
            Удалить
          </button>
        )}
      </div>
    </form>
  );
}
