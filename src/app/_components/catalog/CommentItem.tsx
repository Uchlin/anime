"use client";
import Image from "next/image";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import React, { useState } from "react";

interface User {
  id: string;
  name?: string | null;
  image?: string | null;
}

interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  user: User;
  voteCount: number;
  userVote?: number;
}

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, newText: string) => void;
  onVote: (commentId: string, value: number) => void;
}

import { ArrowUp, ArrowDown } from "lucide-react";

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete, onEdit, onVote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  function handleSave() {
    if (editText.trim() === "") {
      alert("Комментарий не может быть пустым");
      return;
    }
    onEdit(comment.id, editText);
    setIsEditing(false);
  }

  return (
    <div className="mb-4 border pb-4 flex items-start gap-4 rounded p-4">
      <Image
        src={comment.user.image ? `/ava/${comment.user.image}` : "/ava/no.jpg"}
        alt={comment.user.name ?? "User Avatar"}
        width={48}
        height={48}
        className="rounded-full object-cover"
      />
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-white-800">
            {comment.user.name ?? "Аноним"}
          </p>
          <div className="flex gap-2 items-center">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="text-sm text-green-500 hover:underline"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.text);
                  }}
                  className="text-sm text-gray-400 hover:underline"
                >
                  Отмена
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => onDelete(comment.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Удалить
                </button>
              </>
            )}
            <p className="text-sm text-white-500">
              {format(new Date(comment.createdAt), "d MMMM yyyy", { locale: ru })}
            </p>
          </div>
        </div>

        {isEditing ? (
          <textarea
            className="w-full p-2 rounded text-black"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
          />
        ) : (
          <p className="text-white-800 whitespace-pre-wrap">{comment.text}</p>
        )}

        {/* Голосование */}
        <div className="mt-2 flex items-center gap-2 text-white-800">
          <button
            onClick={() => onVote(comment.id, 1)}
            className={`text-xl transition ${
              comment.userVote === 1 ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            ▲
          </button>
          <span className="text-sm font-semibold text-white">
            {comment.voteCount}
          </span>
          <button
            onClick={() => onVote(comment.id, -1)}
            className={`text-xl transition ${
              comment.userVote === -1 ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
};