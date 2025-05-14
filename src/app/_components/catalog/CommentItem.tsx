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
  parentId?: string | null;
  replies?: Comment[];
}
interface CurrentUser {
  id: string;
  isAdmin: boolean;
}
interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, newText: string) => void;
  onVote: (commentId: string, value: number) => void;
  onReply: (text: string, parentId: string) => void;
  currentUser: { id: string; isAdmin: boolean };
}

import { ArrowUp, ArrowDown } from "lucide-react";

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete, onEdit, onVote, onReply, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const isOwner = comment.user.id === currentUser.id;
  const canEditOrDelete = isOwner || currentUser.isAdmin;
  function handleSave() {
    if (editText.trim() === "") {
      alert("Комментарий не может быть пустым");
      return;
    }
    onEdit(comment.id, editText);
    setIsEditing(false);
  }

  function handleReplySubmit() {
    if (replyText.trim() === "") {
      alert("Ответ не может быть пустым");
      return;
    }
    onReply(replyText, comment.id);
    setReplyText("");
    setShowReplyForm(false);
  }
  
  return (
    <div className={`mb-4 border pb-4 flex items-start gap-4 rounded p-4 ${comment.parentId ? 'ml-8 border-l-2 border-gray-700' : ''}`}>
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
            ) : canEditOrDelete ? (
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
            ) : null}
            <p className="text-sm text-white-500">
              {format(new Date(comment.createdAt), "d MMMM yyyy", { locale: ru })}
            </p>
          </div>
        </div>
  
        {isEditing ? (
          <textarea
            className="resize-none w-full p-2 rounded bg-gray-200 text-gray-800"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
          />
        ) : (
          <p className="text-white-800 whitespace-pre-wrap">{comment.text}</p>
        )}
  
        <div className="mt-2 flex items-center gap-2 text-white-800">
          <button
            onClick={() => onVote(comment.id, 1)}
            className={`text-xl transition ${
              comment.userVote === 1 ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            ▲
          </button>
          <span className="text-sm font-semibold text-white-600">
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
  
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="ml-4 text-blue-500 hover:underline text-sm"
          >
            Ответить
          </button>
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <>
            {!showReplies ? (
              <button
                onClick={() => setShowReplies(true)}
                className="mt-2 text-sm text-blue-400 hover:underline"
              >
                Показать {comment.replies.length} ответ{comment.replies.length === 1 ? "" : "а"}
              </button>
            ) : (
              <button
                onClick={() => setShowReplies(false)}
                className="mt-2 text-sm text-blue-400 hover:underline"
              >
                Скрыть ответы
              </button>
            )}
          </>
        )}
        {showReplyForm && (
          <div className="mt-2">
            <textarea
              className="resize-none w-full p-2 rounded bg-red-900 text-white placeholder-gray-300"
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex gap-2 mt-1">
              <button
                onClick={handleReplySubmit}
                className="px-3 py-1 bg-blue-600 rounded text-white hover:bg-blue-700"
              >
                Отправить
              </button>
              <button
                onClick={() => setShowReplyForm(false)}
                className="px-3 py-1 bg-gray-600 rounded text-white hover:bg-gray-700"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onDelete={onDelete}
                onEdit={onEdit}
                onVote={onVote}
                onReply={onReply}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}


      </div>
    </div>
  );  
};