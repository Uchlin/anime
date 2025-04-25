"use client";

import React, { useState } from "react";
import { CommentItem } from "./CommentItem";

interface User {
  id: string;
  name?: string | null;
  image?: string | null;
}

interface AnimeComment {
  id: string;
  text: string;
  createdAt: Date;
  user: User;
  voteCount: number;
  userVote?: number;
}

interface CommentListProps {
  comments: AnimeComment[];
  setComments: React.Dispatch<React.SetStateAction<AnimeComment[]>>;
}

export default function CommentList({ comments, setComments }: CommentListProps) {
  async function handleDelete(commentId: string) {
    if (!confirm("Вы уверены, что хотите удалить этот комментарий?")) return;

    try {
      const response = await fetch("../../api/comments/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });

      if (response.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } else {
        const data = await response.json();
        alert(data.message || "Ошибка при удалении");
      }
    } catch {
      alert("Ошибка сети");
    }
  }

  async function handleEdit(commentId: string, newText: string) {
    try {
      const response = await fetch("../../api/comments/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, newText }),
      });

      if (response.ok) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, text: newText } : c))
        );
      } else {
        const data = await response.json();
        alert(data.message || "Ошибка при обновлении");
      }
    } catch {
      alert("Ошибка сети");
    }
  }
  async function handleVote(commentId: string, value: number) {
    try {
      const response = await fetch("/api/comments/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, value }),
      });
  
      if (response.ok) {
        setComments((prev) =>
          prev.map((c) => {
            if (c.id !== commentId) return c;
  
            let newVoteCount = c.voteCount;
            let newUserVote = c.userVote ?? 0;
  
            if (newUserVote === value) {
              // Если голос совпадает — убираем голос
              newVoteCount -= value;
              newUserVote = 0;
            } else {
              // Если голос другой, корректируем voteCount на разницу
              newVoteCount = newVoteCount - newUserVote + value;
              newUserVote = value;
            }
  
            return { ...c, voteCount: newVoteCount, userVote: newUserVote };
          })
        );
      } else {
        const data = await response.json();
        alert(data.message || "Ошибка при голосовании");
      }
    } catch {
      alert("Ошибка сети");
    }
  }  
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Комментарии</h2>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onVote={handleVote}
          />
        ))
      ) : (
        <p className="text-gray-500">Комментариев пока нет.</p>
      )}
    </section>
  );
}

