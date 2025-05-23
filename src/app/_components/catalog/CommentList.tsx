"use client";

import React, { useState } from "react";
import { CommentItem } from "./CommentItem";
import { useSearchParams } from "next/navigation";
import Pagination from "~/app/ui/pagination";

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
  parentId?: string | null;
  replies?: AnimeComment[];
}
interface CurrentUser {
  id: string;
  isAdmin: boolean;
}
interface CommentListProps {
  comments: AnimeComment[];
  setComments: React.Dispatch<React.SetStateAction<AnimeComment[]>>;
  animeId: string;
  currentUser: { id: string; isAdmin: boolean };
}

export default function CommentList({ comments, setComments, animeId, currentUser }: CommentListProps) {
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
  async function handleReply(text: string, parentId: string) {
    try {
      console.log("Отправляю комментарий", { text, parentId, animeId });
      const response = await fetch("../../api/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, parentId, animeId }),
      });
  
      if (response.ok) {
        const newComment: AnimeComment = await response.json();
        setComments((prev) => [newComment, ...prev]);
      } else {
        const data = await response.json();
        alert(data.message || "Ошибка при добавлении ответа");
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
  function buildCommentTree(flatComments: AnimeComment[]): AnimeComment[] {
    const commentMap = new Map<string, AnimeComment>();
    flatComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    const roots: AnimeComment[] = [];

    commentMap.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies!.push(comment);
        }
      } else {
        roots.push(comment);
      }
    });

    return roots;
  }
  const parentComments = comments.filter((c) => !c.parentId);
  const repliesMap = new Map<string, AnimeComment[]>();
  comments.forEach((comment) => {
    if (comment.parentId) {
      if (!repliesMap.has(comment.parentId)) {
        repliesMap.set(comment.parentId, []);
      }
      repliesMap.get(comment.parentId)!.push(comment);
    }
  });
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const COMMENTS_PER_PAGE = 2;
  const totalPages = Math.ceil(parentComments.length / COMMENTS_PER_PAGE);
  const paginatedParents = parentComments.slice(
      (currentPage - 1) * COMMENTS_PER_PAGE,
      currentPage * COMMENTS_PER_PAGE
    );
    function collectDescendants(parentIds: string[], allComments: AnimeComment[]): AnimeComment[] {
    const descendants: AnimeComment[] = [];

    function recurse(parents: string[]) {
      const children = allComments.filter((c) => c.parentId && parents.includes(c.parentId));
      if (children.length > 0) {
        descendants.push(...children);
        recurse(children.map((c) => c.id));
      }
    }

    recurse(parentIds);
    return descendants;
  }
  const parentIds = paginatedParents.map((c) => c.id);
  const allReplies = collectDescendants(parentIds, comments);
  const fullTree = buildCommentTree([...paginatedParents, ...allReplies]);
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Комментарии</h2>
      
      {paginatedParents.length > 0 ? (
        fullTree.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onVote={handleVote}
            onReply={handleReply}
            currentUser={currentUser}
          />
        ))
      ) : (
        <p className="text-gray-500">Комментариев пока нет.</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </section>
  );
}